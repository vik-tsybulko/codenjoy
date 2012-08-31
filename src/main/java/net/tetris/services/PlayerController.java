package net.tetris.services;

import net.tetris.dom.Figure;
import net.tetris.dom.Joystick;
import net.tetris.dom.TetrisGame;
import org.apache.commons.lang.StringUtils;
import org.eclipse.jetty.client.ContentExchange;
import org.eclipse.jetty.client.HttpClient;
import org.eclipse.jetty.util.thread.ExecutorThreadPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * User: serhiy.zelenin
 * Date: 6/3/12
 * Time: 10:40 PM
 */
public class PlayerController {
    private static Logger logger = LoggerFactory.getLogger(PlayerController.class);

    private HttpClient client;
    private int timeout;

    public void requestControl(final Player player, Figure.Type type, int x, int y, final Joystick joystick, List<Plot> plots) throws IOException {
        ContentExchange exchange = new MyContentExchange(joystick, player);

        exchange.setMethod("GET");
        String callbackUrl = player.getCallbackUrl().endsWith("/") ? player.getCallbackUrl() : player.getCallbackUrl() + "/";
        StringBuilder sb = exportGlassState(plots);

        String url = callbackUrl + "?figure=" + type + "&x=" + x + "&y=" + y + "&glass=" + URLEncoder.encode(sb.toString(), "UTF-8");
        exchange.setURL(url);
        client.send(exchange);
    }


    private StringBuilder exportGlassState(List<Plot> plots) {
        char[][] glassState = new char[TetrisGame.GLASS_HEIGHT][TetrisGame.GLASS_WIDTH];
        for (int i = 0; i < TetrisGame.GLASS_HEIGHT; i++) {
            Arrays.fill(glassState[i], ' ');
        }

        for (Plot plot : plots) {
            glassState[plot.getY()][plot.getX()] = '*';
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < TetrisGame.GLASS_HEIGHT; i++) {
            sb.append(glassState[i]);
        }
        return sb;
    }

    /**
     * Timeout for player request for the next direction
     *
     * @param timeout
     */
    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    public void init() throws Exception {
        client = new HttpClient();
        client.setConnectorType(HttpClient.CONNECTOR_SELECT_CHANNEL);
        client.setThreadPool(new ExecutorThreadPool(4, 256, timeout, TimeUnit.SECONDS));
        client.setTimeout(timeout);
        client.start();
    }

    public static class MyContentExchange extends ContentExchange {
        private final Joystick joystick;
        private final Player player;
        private Pattern pattern = Pattern.compile("((left)=(\\d*))|((right)=(\\d*))|((rotate)=(\\d*))|(drop)", Pattern.CASE_INSENSITIVE);

        public MyContentExchange(Joystick joystick, Player player) {
            this.joystick = joystick;
            this.player = player;
        }

        protected void onResponseComplete() throws IOException {
            String responseContent = this.getResponseContent();
            process(responseContent);
        }

        public void process(String responseContent) {
            Matcher matcher = pattern.matcher(responseContent);
            while (matcher.find()) {
                int groupsCount = matcher.groupCount();
                for (int i = 0; i <= groupsCount; i++) {
                    String group = matcher.group(i);
                    if (null == group) {
                        continue;
                    }
                    if (recognizeCommand(matcher, i, group)) {
                        break;
                    }
                }
            }
        }

        private boolean recognizeCommand(Matcher matcher, int i, String group) {
            try {
                switch (group.toLowerCase()) {
                    case "left":
                        joystick.moveLeft(Integer.parseInt(matcher.group(i + 1)));
                        return true;
                    case "right":
                        joystick.moveRight(Integer.parseInt(matcher.group(i + 1)));
                        return true;
                    case "rotate":
                        joystick.rotate(Integer.parseInt(matcher.group(i + 1)));
                        return true;
                    case "drop":
                        joystick.drop();
                        return true;
                }
            } catch (NumberFormatException e) {
                logger.error("Player " + player.getName() + " sent wrong command", e);
            }
            return false;
        }
    }
}

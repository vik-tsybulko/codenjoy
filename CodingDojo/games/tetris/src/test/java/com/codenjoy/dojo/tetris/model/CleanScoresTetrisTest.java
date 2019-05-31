package com.codenjoy.dojo.tetris.model;

import com.codenjoy.dojo.services.Dice;
import com.codenjoy.dojo.services.EventListener;
import com.codenjoy.dojo.services.Point;
import com.codenjoy.dojo.services.printer.BoardReader;
import com.codenjoy.dojo.services.printer.Printer;
import com.codenjoy.dojo.services.printer.PrinterFactory;
import com.codenjoy.dojo.services.printer.PrinterFactoryImpl;
import com.codenjoy.dojo.tetris.model.levels.gamelevel.FigureTypesLevel;
import org.junit.Test;

import java.util.LinkedList;
import java.util.List;

import static com.codenjoy.dojo.tetris.model.GlassEvent.Type.FIGURE_DROPPED;
import static com.codenjoy.dojo.tetris.model.Type.*;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

public class CleanScoresTetrisTest {

    private Tetris game;
    private Hero hero;
    private Dice dice = mock(Dice.class);
    private EventListener listener;
    private Player player;
    private Figures queue;
    private PrinterFactoryImpl printerFactory;
    private Levels levels;

    static class TestLevels extends Levels {

        public TestLevels(Dice dice, Figures queue) {
            super(new FigureTypesLevel(dice, queue,
                            new GlassEvent<>(FIGURE_DROPPED, O), // ignored
                            O),

                    new FigureTypesLevel(dice, queue,
                            new GlassEvent<>(FIGURE_DROPPED, O),
                            O, I),

                    new FigureTypesLevel(dice, queue,
                            new GlassEvent<>(FIGURE_DROPPED, I),
                            O, I, J),

                    new FigureTypesLevel(dice, queue,
                            new GlassEvent<>(FIGURE_DROPPED, J),
                            O, I, J, L)
            );
        }
    }

    private void givenFl(String board) {
        printerFactory = new PrinterFactoryImpl<>();
        Level level = new LevelImpl(board);
        List<Plot> plots = level.plots();

        queue = new Figures();
        levels = new TestLevels(dice, queue);
        game = new Tetris(levels, queue, level.size());
        listener = mock(EventListener.class);
        player = new Player(listener);
        game.newGame(player);
        Glass glass = game.getPlayer().getHero().glass();
        game.setPlots(glass, plots);
        hero = game.getPlayer().getHero();
        reset(listener);
    }

    @Test
    public void shouldChangeLevel_whenAcceptCriteria() {
        // given
        Figures.DEFAULT_FUTURE_COUNT = 1;
        when(dice.next(anyInt())).thenReturn(0);

        givenFl("......." +
                "......." +
                "......." +
                "......." +
                "......." +
                "......." +
                ".......");
        // when
        game.tick();

        // then
        assertEquals(1, levels.getCurrentLevel().openCount());

        assrtDr("..OO..." +
                "..OO..." +
                "......." +
                "......." +
                "......." +
                "......." +
                ".......");

        // when
        when(dice.next(anyInt())).thenReturn(1);
        hero.left();
        hero.down();
        game.tick();

        // then
        assertEquals(2, levels.getCurrentLevel().openCount());

        assrtDr("..OO..." +
                "..OO..." +
                "......." +
                "......." +
                "......." +
                ".OO...." +
                ".OO....");

        // when
        when(dice.next(anyInt())).thenReturn(1);
        hero.right();
        hero.down();
        game.tick();

        // then
        assertEquals(2, levels.getCurrentLevel().openCount());

        assrtDr("..I...." +
                "..I...." +
                "......." +
                "......." +
                "......." +
                ".OOOO.." +
                ".OOOO..");

        // when
        when(dice.next(anyInt())).thenReturn(2);
        hero.act();
        hero.down();
        game.tick();

        // then
        assertEquals(3, levels.getCurrentLevel().openCount());

        assrtDr("..I...." +
                "..I...." +
                "......." +
                "......." +
                "IIII..." +
                ".OOOO.." +
                ".OOOO..");

        // when
        when(dice.next(anyInt())).thenReturn(2);
        hero.act();
        hero.down();
        game.tick();

        // then
        assertEquals(3, levels.getCurrentLevel().openCount());

        assrtDr("...J..." +
                "..JJ..." +
                "......." +
                "IIII..." +
                "IIII..." +
                ".OOOO.." +
                ".OOOO..");
    }

    @Test
    public void shouldResetLevelsNadGlass_whenCleanScores() {
        // given
        shouldChangeLevel_whenAcceptCriteria();

        // when
        when(dice.next(anyInt())).thenReturn(0);

        game.clearScore();
        hero = game.getPlayer().getHero();

        game.tick();

        // then
        assertEquals(1, levels.getCurrentLevel().openCount());

        assrtDr("..OO..." +
                "..OO..." +
                "......." +
                "......." +
                "......." +
                "......." +
                ".......");
    }

    @Test
    public void shouldIgnoreCommands_whenCleanScores() {
        // given
        shouldChangeLevel_whenAcceptCriteria();

        // when
        when(dice.next(anyInt())).thenReturn(0);

        game.clearScore();
        hero = game.getPlayer().getHero();

        // should be ignored
        hero.act();
        hero.left();
        hero.right();

        game.tick();

        // then
        assertEquals(1, levels.getCurrentLevel().openCount());

        assrtDr("..OO..." +
                "..OO..." +
                "......." +
                "......." +
                "......." +
                "......." +
                ".......");
    }

    private void assrtDr(String expected) {
        Printer printer = printerFactory.getPrinter(new BoardReader() {
            @Override
            public int size() {
                return game.size();
            }

            @Override
            public Iterable<? extends Point> elements() {
                return new LinkedList<Plot>() {{
                    addAll(hero.dropped());
                    addAll(hero.currentFigure());
                }};
            }
        }, player);

        assertEquals(com.codenjoy.dojo.utils.TestUtils.injectN(expected),
                printer.print().toString().replaceAll(" ", "."));
    }

}

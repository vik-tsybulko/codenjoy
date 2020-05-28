﻿// vendor
import React, {  Component  } from 'react';
import {  connect  } from 'react-redux';
// import classnames from 'classnames';
import {  Link  } from 'react-router-dom';
import {  CopyToClipboard  } from 'react-copy-to-clipboard';

// proj
import {  GameElements  } from '../../components';
import {  getGameConnectionString, getJavaClient  } from '../../utils';
import { requestSettingsStart } from '../../redux/settings';
import {  book  } from '../../routes';
import Icon from '../../styles/images/icons/rules.svg';
import BoardSample from '../../styles/images/game/field-sample.png';

// own
import Styles from './styles.module.css';

const BOARD_EXAMPLE =
`board=☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼     &        #  #   ☼☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼
☼ ☼ ☼☼    # # #      ####  ☼☼ ☼ ☼ ☼ ☼ ☼#☼ ☼ ☼ ☼ ☼ ☼☼☺            #
  #☼☼ ☼ ☼ ☼ ☼҉☼ ☼ ☼#☼ ☼ ☼#☼☼# ### + ҉        &  #☼☼#☼ ☼ ☼ ☼҉☼♥☼ ☼ ☼ ☼
☼ ☼☼     ♣H҉҉H     #  #  ☼☼#☼ ☼#☼ ☼҉☼ ☼ ☼ ☼ ☼ ☼ ☼☼ # #    ҉#    # ♥
  ☼☼ ☼ ☼ ☼#☼҉☼ ☼ ☼ ☼ ☼ ☼ ☼☼                     ☼☼ ☼ ☼#☼ ☼ ☼ ☼ ☼ ☼ ☼♣
☼ ☼☼        &            ☼☼ ☼ ☼#☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼☼  # #  #
# ☼☼&☼#☼ ☼ ☼ ☼ ☼#☼ ☼#☼ ☼ ☼☼     #           # & ☼☼ ☼#☼ ☼#☼ ☼ ☼ ☼#☼ ☼
☼ ☼☼##  #      #  #    # ☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼`;

const BOARD_EXAMPLE_2 =
`☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼
☼     &        #  #   ☼
☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼
☼    # # #      ####  ☼
☼ ☼ ☼ ☼ ☼ ☼#☼ ☼ ☼ ☼ ☼ ☼
☼☺            #      #☼
☼ ☼ ☼ ☼ ☼҉☼ ☼ ☼#☼ ☼ ☼#☼
☼# ### + ҉        &  #☼
☼#☼ ☼ ☼ ☼҉☼♥☼ ☼ ☼ ☼ ☼ ☼
☼     ♣H҉҉H     #  #  ☼
☼#☼ ☼#☼ ☼҉☼ ☼ ☼ ☼ ☼ ☼ ☼
☼ # #    ҉#    # ♥    ☼
☼ ☼ ☼ ☼#☼҉☼ ☼ ☼ ☼ ☼ ☼ ☼
☼                     ☼
☼ ☼ ☼#☼ ☼ ☼ ☼ ☼ ☼ ☼♣☼ ☼
☼        &            ☼
☼ ☼ ☼#☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼ ☼
☼  # #  #           # ☼
☼&☼#☼ ☼ ☼ ☼ ☼#☼ ☼#☼ ☼ ☼
☼     #           # & ☼
☼ ☼#☼ ☼#☼ ☼ ☼ ☼#☼ ☼ ☼ ☼
☼##  #      #  #    # ☼
☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼`;

const {  boardExample, mask, highligte, highligteNotes  } = Styles;

class RulesContainer extends Component {
    componentDidMount() {
        this.props.requestSettingsStart();
    }

    render() {
        const {  server, code, id, settings  } = this.props;
        const loggedIn = [ server, code, id ].every(Boolean);
        const connectionUrl = loggedIn
            ? getGameConnectionString(server, code, id)
            : void 0;
        const privacyRulesUrl = process.env.REACT_APP_EVENT_LINK + '/privacyRules';
        const privacyRulesDetailsUrl = privacyRulesUrl + '#details3';
        const joinSlackUrl = process.env.REACT_APP_JOIN_CHAT_LINK;
        const clientLink = loggedIn
            ? (
                <a href={ getJavaClient(server) }>Завантажити клієнт</a>
            )
            : ''

        return (
            <div className='container'>
                <div className={ mask }>Bot Challenge - як грати?</div>
                <div className='content'>
                    <h2 className='title'>У чому суть гри?</h2>
                    <p>
                        Потрібно написати свого Бота для героя, який обіграє інших
                        Ботів за сумою балів. Всі грають на одному полі. Герой може
                        пересуватися по відкритим клітинкам в усі чотири
                        сторони.
                    </p>
                    <p>
                        Герой може також поставити бомбу. Бомба вибухне через 5
                        тиків (секунд). Вибуховою хвилею бомби можна зачепити
                        мешканців поля. Всі, хто був зачеплений - зникаї.
                        Підірватися можна і на своїй, і на чужій бомбі.
                    </p>
                    <p>
                        На своєму шляху герой може зустріти Мітчопера - червону
                        повітряну кульку, що знищує на своєму шляху всіх
                        Бомберменів.
                    </p>
                    <p>
                        Бомберменові перешкождатимуть в пересуванні також і стіни
                        - їх є два типи: такі, що можна зруйнувати; i незруйновані.
                    </p>
                    <p>
                        Кожен зруйнований об'єкт на полі (Бомбермен, Мітчопер
                        та стіни які руйнуються) після руйнування відновлюється в
                        іншому місці. Якщо постраждав Бомбермен, йому
                        зараховуються штрафні бали<a href='#settings'>*</a>.
                    </p>
                    <p>
                        Бомбермен, від бомби якого сталися руйнування на мапі
                        отримає бонусні бали: за зруйновану стінку
                        <a href='#settings'>*</a>, за Мітчопера<a href='#settings'>*</a>,
                        за іншого Бомбермена<a href='#settings'>*</a>. Бали сумуються.
                    </p>

                    <div className='subTitle' id='client'>
                        Завантажте Клієнт гри для створення Бота
                    </div>
                    <p>
                        { clientLink }
                        { !loggedIn && '(посилання стануть доступні після входу на сайт)' }
                    </p>
                    <p>
                        Пам'ятайте: у процесі написання Бота вам необхідно
                        піклуватись про логіку переміщень вашого Бота -
                        допоміжні речі вже зроблені за вас. Але ви можете
                        вдосконалювати логіку Клієнта на власний розсуд.
                    </p>
                    <p>
                        Зареєструйтеся за допомогою форми реєстрації Нового
                        Гравця. Запам'ятайте вказані дані (адресу електронної пошти
                        і пароль) - вони знадобляться вам у майбутньому для
                        авторизації на сайті.
                    </p>
                    <p>
                        Далі необхідно приєднатися з коду Клієнта до сервера.
                    </p>

                    <div className='subTitle'>
                        Адреса для підключення до гри на сервері
                    </div>

                    { loggedIn ? (
                        <>
                            <div className={ highligte }>
                                { connectionUrl }
                                <CopyToClipboard text={ connectionUrl }>
                                    <img
                                        className={ Styles.copyConnection }
                                        src={ Icon }
                                        alt='Скопіювати адрес'
                                    />
                                </CopyToClipboard>
                            </div>
                            <div className={ highligteNotes }>
                                Тут 'user' - id гравця, a 'code' - ваш security token,
                                його ви зможете отримати тут після реєстрації/логіна.
                            </div>
                        </>
                    ) : (
                        <div className={ highligte }>
                            <Link to={ book.login }>
                                Потрібно увійти в систему для отримання посилання
                            </Link>
                        </div>
                    ) }

                    <p>
                        Після підключення клієнт буде регулярно (кожну секунду)
                        отримувати рядок символів із закодованим станом поля.
                        Формат такий.
                        <br />
                    </p>
                    <p className={ highligte }>
                        { '^board=(.*)$' }
                    </p>
                    <p>
                        За допомогою цього regexp можна отримати рядок дошки.
                    </p>

                    <div className='subTitle'>
                        Приклад рядка від сервера
                    </div>
                    <div className={ highligte }>
                        <pre className={ boardExample }>{ BOARD_EXAMPLE }</pre>
                    </div>
                    <p>
                        Довжина рядка дорівнює площі поля. Якщо вставити символ
                        розриву рядків кожні sqrt(length(string)) символів, то
                        вийде читабельним зображення поля.
                    </p>
                    <div className={ highligte }>
                        <pre className={ boardExample }>{ BOARD_EXAMPLE_2 }</pre>
                    </div>
                    <p>
                        Перший символ рядка відповідає осередку розташованої в
                        лівому верхньому кутку і має координату [0,32]. У цьому
                        прикладі – позиція Бомбермена (символ '☺') - [19, 25].
                        Лівий нижній кут має координату [0, 0].
                    </p>

                    <div className='subTitle'>
                        Розшифрування символів
                    </div>
                    <p>
                        <img src={ BoardSample } alt='Ігрове поле'/>
                    </p>
                    <GameElements />

                    <div className='subTitle'>
                        Керування ботом
                    </div>
                    <p>
                        Гра покрокова, кожну секунду сервер відправляє вашому
                        клієнту (Боту) стан оновленого поля на поточний момент і
                        чекає на відповідь команди героя. За наступну секунду
                        гравець повинен встигнути дати команду герою. Якщо не
                        встиг - герой стоїть на місці.
                    </p>
                    <p>
                        Команд декілька: UP, DOWN, LEFT, RIGHT - призводять до
                        руху героя в заданому напрямку на 1 клітинку; ACT -
                        залишити бомбу на місці героя. Команди руху можна
                        комбінувати з командою ACT, розділяючи їх через кому.
                        Порядок (LEFT, ACT) або (ACT, LEFT) - має значення, або
                        рухаємося вліво і там ставимо бомбу, або ставимо бомбу, а
                        потім біжимо вліво. Якщо гравець буде використовувати
                        тільки одну команду ACT, то бомба буде встановлена під
                        героєм без його переміщення на полі.
                    </p>
                    <p>
                        Ваше завдання - написати вебсокет клієнта, який підключиться
                        до сервера. Потім змусити героя слухатися команди. Головна
                        мета - вести осмислену гру і перемогти, набравши
                        найбільшу кількість балів в поточному Iгровому днi.
                    </p>

                    <div className='subTitle'>
                        Раунди/матчі
                    </div>
                    <ul>
                        <li>
                            Матч складається з декiлькох<a href='#settings'>*</a> Раундiв.
                        </li>
                        <li>
                            Кожний Матч починається в новiй Кімнаті після того, як в ній
                            збереться достатня<a href='#settings'>*</a> кількість Учасників.
                        </li>
                        <li>
                            Кожний Раунд Матчу проходить з певним складом Участників.
                        </li>
                        <li>
                            Учасник, який закінчив останній Раунд Матчу, одразу попадає
                            до нової кімнати, де після того, як збереться достатня кількість
                            Участників почнеться новий Матч у новому складі Участників.
                        </li>
                        <li>
                            Раунд триває певну<a href='#settings'>*</a> кількість тіків (секунд) і закінчується
                            перемогою Бомбермена, який зробив найбiльше руйнувань - якщо до
                            кінця Раунду залишились живими більше ніж 1 Бомбермен.
                        </li>
                        <li>
                            Якщо ж на полі живим лишився тільки один Бомбермен -
                            він і перемагає.
                        </li>
                        <li>
                            Переможець Раунду отримує бонусні бали додатково до тих балів,
                            які отримані під час Раунду за руйнування об'єктів на полі
                            (Бомбермени, Мітчопери та стіни які руйнуються)
                        </li>
                    </ul>

                    <div className='subTitle'>
                        Особливі випадки
                    </div>
                    <ul>
                        <li>
                            Бомба залишена на полі підірветься через 5 тіків.
                        </li>
                        <li>
                            Бомбермен, який підірвався на своїй або чужій бомбі гине і
                            отримує штрафні бали<a href='#settings'>*</a>.
                        </li>
                        <li>
                            Бомбермен, бомба якого підірвала Мітчопера отрумує
                            бонусні бали<a href='#settings'>*</a>.
                        </li>
                        <li>
                            Бомбермен, бомба якого підірвала іншого Бомбермена отрумує
                            бонусні бали<a href='#settings'>*</a>.
                        </li>
                        <li>
                            Бомбермен, бомба якого підірвала стінку що руйнується
                            отрумує бонусні бали<a href='#settings'>*</a>.
                        </li>
                        <li>
                            Під час руйнування стінки може з'явитись Перк.
                        </li>
                        <li>
                            Перк, піднятий Бомберменом модифікує поведінку деяких ігрових
                            аспектів (див. розділ 'Модифікатори (Перки)').
                        </li>
                        <li>
                            Бомбермен, який зустрівся із Мітчопером гине і отримує
                            штрафні бали<a href='#settings'>*</a>.
                        </li>
                        <li>
                            Бомбермен, який примусово покинув Матч отримує
                            штрафні бали<a href='#settings'>*</a>.
                        </li>
                        <li>
                            За перемогу в Раунді Матчу Бомбермен отримуе
                            бонусні бали<a href='#settings'>*</a>.
                        </li>
                    </ul>

                    <div className='subTitle'>
                        Модифікатори (Перки)
                    </div>
                    <ul>
                        <li>
                            Перки випадають на місці знищенної стіни з
                            певною<a href='#settings'>*</a> верогідністю.
                        </li>
                        <li>
                            Дія перку зникає через деякий<a href='#settings'>*</a> час,
                            якщо не вказано інакше в описі перку.
                        </li>
                        <li>
                            Якщо перк ніхто не підібрав, він зникає з поля
                            після черезх деякий<a href='#settings'>*</a> час.
                        </li>
                    </ul>

                    <div className='subTitle'>
                        Підказки
                    </div>
                    <p>
                        Якщо Ви не знаєте, що написати, спробуйте реалізувати
                        наступні варіанти алгоритмів:
                    </p>
                    <ul>
                        <li>
                            Переміщення у випадкову сторону, якщо відповідна
                            клітина вільна.
                        </li>
                        <li>
                            Рух на вільну клітину в бік найближчої стінки,
                            що можно зруйнувати.
                        </li>
                        <li>
                            Поставити бомбу рядом із стінкою, ща можно зруйнувати.
                        </li>
                        <li>
                            Ухилення від бомб, якщо підраховано що її взривна
                            хвиля може зачепити Бомбермена.
                        </li>
                        <li>
                            Ухилення від Мітчоперів, що зустрілися на шляху.
                        </li>
                        <li>
                            Намагання підірвати Мітчопера або іншого Бомбермена бомбою.
                        </li>
                        <li>
                            Збір Перків і реалізація хитрішої стратегії, що безумовно
                            призведе до перемоги.
                        </li>
                    </ul>

                    <div className='subTitle'>
                        Як визначатимуться переможці?
                    </div>
                    <p>
                        Детальніше про це можно прочитати
                        &nbsp;
                        <a href={ privacyRulesDetailsUrl }>
                            за посиланням<img src={ Icon } alt='Правила Конкурсу'/>
                        </a>
                    </p>

                    <div className='subTitle'>
                        Додаткова інформація
                    </div>
                    <p id='settings'>
                        * - Точні значення: балів за руйнування на полі та штрафних балів;
                        кількості Раундів в Матчі; сили ефекту, таймаутів, вірогідності
                        випадання Перків та інших змінних треба уточнити у організаторів
                        на початку Ігрового Дня в Slack чаті.
                    </p>
                    <p>
                        Будьте уважні - ці значення відрізнятимуться для різних
                        Ігрових днів Конкурсу.
                    </p>
                    <p>
                        Для спілкування між Участниками та Організатором
                        створено Канал у додатку Slack, приєднатися до якого
                        можна
                        &nbsp;
                        <a href={ joinSlackUrl } rel='noopener noreferrer' target='_blank'>
                            за посиланням<img src={ Icon } alt='Долучитися до чату'/>
                        </a>
                    </p>
                    <p>
                        Із детальним описом Правил і Положень гри можна
                        ознайомитися
                        &nbsp;
                        <a href={ privacyRulesUrl }>
                            за посиланням<img src={ Icon } alt='Правила Конкурсу'/>
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    id:       state.auth.id,
    server:   state.auth.server,
    code:     state.auth.code,
    settings: state.settings.settings,
});
const mapDispatchToProps = { requestSettingsStart };

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RulesContainer);

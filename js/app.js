'use	strict';

var my_news = [
    {
        author: 'Саша	Печкин',
        text: 'В	четчерг,	четвертого	числа...',
        bigText: 'в	четыре	с	четвертью	часа	четыре	чёрненьких	чумазеньких	чертёнка	чертили чёрными	чернилами	чертёж.'
    },
    {
        author: 'Просто	Вася',
        text: 'Считаю,	что	$	должен	стоить	35	рублей!',
        bigText: 'А	евро	42!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно.	Скачать.	Лучший	сайт	-	http://localhost:3000',
        bigText: 'На	самом	деле	платно,	просто	нужно	прочитать	очень	длинное	лицензионное соглашение'
    }
];

window.ee = new EventEmitter();
var Article = React.createClass({
    propTypes: {
        articleData: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function () {
        return {
            visible: false,
            rating: 0,
            article_prop: 'svoistvo'
        };
    },
    readmoreClick: function (e) {
        e.preventDefault();
        this.setState(
            {
                rating: 100500,
                visible: true,
                article_prop: 'привет'
            },
            function () {
                alert('Состояние изменилось');
            });
    },

    render: function () {
        var author = this.props.articleData.author;
        var text = this.props.articleData.text;
        var bigText = this.props.articleData.bigText;
        var visible = this.state.visible;
        return (
            <div className="article">
                <p className="news__author">{author}:</p>
                <p className="news__text">{text}</p>
                <a href="#"
                   onClick={this.readmoreClick}
                   className={'news_readmore ' + (visible ? 'none' : '')}>
                    Подробнее
                </a>
                <p className={'news__big-text ' + (visible ? '' : 'none')}>{bigText}</p>
            </div>
        )
    }
});

var News = React.createClass({
    getInitialState: function () {
        return {counter: 0};
    },

    render: function () {
        var svoistvo = this.props.kakoe_to_svoistvo;
        var newsTemplate;
        var counter = this.state.counter;
        if (svoistvo.length > 0) {
            newsTemplate = svoistvo.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article articleData={item}/>
                    </div>
                )
            })
        } else {
            newsTemplate = <p>К сожалению новостей нет</p>
        }

        return (
            <div className="news">
                {newsTemplate}
                <strong
                    className={svoistvo.length > 0 ? '' : 'none'}>
                    Всего новостей: {svoistvo.length}
                </strong>
            </div>
        );

    }
});


var Add = React.createClass({
    componentDidMount: function () {	//ставим	фокус	в	input
        ReactDOM.findDOMNode(this.refs.author).focus();
    },

    getInitialState: function () {
        return {
            authorIsEmpty: true,
            agreeNotChecked: true,
            textIsEmpty: true
        }
    },

    onBtnClickHandler: function (e) {
        e.preventDefault();
        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = ReactDOM.findDOMNode(this.refs.text).value;
        var item = [{
            author: author,
            text: text,
            bigText: '...'
        }];
        window.ee.emit('News.add', item);


    },
    onCheckRuleClick: function (e) {
        ReactDOM.findDOMNode(this.refs.alert_button).disabled = !e.target.checked;
        this.setState({agreeNotChecked: !e.target.checked});
    },
    onFieldChange: function (fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({['' + fieldName]: false})
        } else {
            this.setState({['' + fieldName]: true})
        }
    },

    render: function () {
        return (
            <div>
                <form className='add cf'>
                    <input
                        type='text'
                        className='add__author'
                        defaultValue=''
                        onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                        placeholder='Ваше имя'
                        ref='author'
                    />
                    <textarea
                        className='add__text'
                        defaultValue=''
                        onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                        placeholder='Текст новости'
                        ref='text'
                    />
                    <label className='add__checkrule'>
                        <input type='checkbox' defaultChecked={false} ref='checkrule' onChange={this.onCheckRuleClick}/>
                        Я согласен с правилами
                    </label>
                    <button
                        className='add__btn'
                        onClick={this.onBtnClickHandler}
                        ref='alert_button'
                        disabled={this.state.agreeNotChecked || this.state.authorIsEmpty || this.state.textIsEmpty}
                    >
                        Добавить новость
                    </button>
                </form>

            </div>
        );
    }
});

var App = React.createClass({
    getInitialState: function () {
        return {
            news: my_news
        };
    },
    componentDidMount: function () {
        var self = this;
        window.ee.addListener('News.add', function (item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },
    componentWillUnmount: function () {
        window.ee.removeListener('News.add');
    },
    render: function () {
        console.log('render');
        return (
            <div className='app'>
                <Add    />
                <h3>Новости</h3>
                <News kakoe_to_svoistvo={this.state.news}/>
            </div>
        );
    }
});


ReactDOM.render(
    <App />,
    document.getElementById('root')
);
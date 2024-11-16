const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleSnowflake = (e, onSnowflakeAdded) => {
    e.preventDefault();
    helper.hideError();

    const word = e.target.querySelector('#snowflakeWord').value;
    const user = e.target.querySelector('#domoUser').value;

    if (!word || !user) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { word: word, user: user }, onSnowflakeAdded);
    return false;
}

const SnowflakeForm = (props) => {
    return (
        <form id="snowflakeForm"
            onSubmit={(e) => handleSnowflake(e, props.triggerReload)}
            name="snowflakeForm"
            action="/snowflake"
            method="POST"
            className="snowflakeForm"
        >
            <label htmlFor="word">Word: </label>
            <input id="word" type="text" name="word" placeholder="Type something unique" />
            <label htmlFor="user">User: </label>
            <input id="user" type="text" name="user" placeholder="This will be handled more gracefully later" />
            
            <input className="playSnowflakeSubmit" type="submit" value="Submit Snowflake" />
        </form>
    )
}

const SnowflakeList = (props) => {
    const [snowflake, setSnowflake] = useState(props.snowflake);

    useEffect(() => {
        const loadSnowflakesFromServer = async () => {
            const response = await fetch('/getSnowflakes');
            const data = await response.json();
            setSnowflake(data.snowflakes);
        };
        loadSnowflakesFromServer();
    }, [props.reloadSnowflakes]);

    if (snowflake.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const snowflakeNodes = snowflake.map(snowflake => {
        return (
            <div key={snowflake.id} className="snowflake">
                <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="snowflakeWord">Word: {snowflake.word}</h3>
                <h3 className="snowflakeUser">Submitted by: {snowflake.owner}</h3>
            </div>
        );
    });

    return (
        <div className="snowflakeList">
            {snowflakeNodes}
        </div>
    );
};

const MatchingSnowflakeList = (props) => {
    const [snowflakes, setSnowflakes] = useState(props.snowflakes);

    useEffect(() => {
        const loadSnowflakesFromServer = async () => {
            const response = await fetch('/getMatchingSnowflakes');
            const data = await response.json();
            setSnowflakes(data.snowflakes);
        };
        loadSnowflakesFromServer();
    }, [props.reloadSnowflakes]);

    if (snowflakes.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const snowflakeNodes = snowflakes.map(snowflake => {
        return (
            <div key={snowflake.id} className="snowflake">
                <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="snowflakeWord">Word: {snowflake.word}</h3>
                <h3 className="snowflakeUser">Submitted by: {snowflake.owner}</h3>
            </div>
        );
    });

    return (
        <div className="snowflakeList">
            {snowflakeNodes}
        </div>
    );
};

const App = () => {
    const [reloadSnowflakes, setReloadSnowflakes] = useState(false);

    return (
        <div>
            <div id="playSnowflake">
                <SnowflakeForm triggerReload={() => setReloadSnowflakes(!reloadSnowflakes)} />
            </div>
            
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('snowflake'));
    root.render(<App />);
};

window.onload = init;
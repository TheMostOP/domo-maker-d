const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleSnowflake = async (e, onSnowflakeAdded, updateMatchingSnowflakes) => {
    e.preventDefault();
    helper.hideError();

    const word = e.target.querySelector('#snowflakeWord').value;

    if (!word) {
        helper.handleError('All fields are required');
        return false;
    }

    try {
        const response = await helper.sendPost(e.target.action, { word });
        if (response.matches) {
            updateMatchingSnowflakes(response.matches);
        }
        onSnowflakeAdded(); // Trigger reload of the main snowflake list
    } catch (err) {
        console.error('Error submitting snowflake:', err);
    }

    return false;
}

const SnowflakeForm = (props) => {
    return (
        <form id="snowflakeForm"
            onSubmit={(e) => handleSnowflake(e, props.triggerReload, props.updateMatchingSnowflakes)}
            name="snowflakeForm"
            action="/snowflake"
            method="POST"
            className="snowflakeForm"
        >
            <label htmlFor="word">Word: </label>
            <input id="word" type="text" name="word" placeholder="Type something unique" />
            <label htmlFor="user">User: </label>
            <input id="user" type="text" name="user" placeholder="Enter your username" />
            <input className="playSnowflakeSubmit" type="submit" value="Submit Snowflake" />
        </form>
    );
};

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
    if (!props.snowflakes || props.snowflakes.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Matching Snowflakes Found!</h3>
            </div>
        );
    }

    const snowflakeNodes = props.snowflakes.map((snowflake, index) => {
        return (
            <div key={index} className="snowflake">
                <img src="assets/img/domoface.jpeg" alt="snowflake face" className="snowflakeFace" />
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
    const [matchingSnowflakes, setMatchingSnowflakes] = useState([]);

    return (
        <div>
            <div id="playSnowflake">
                <SnowflakeForm
                    triggerReload={() => setReloadSnowflakes(!reloadSnowflakes)}
                    updateMatchingSnowflakes={setMatchingSnowflakes}
                />
            </div>
            <div id="snowflakes">
                <SnowflakeList snowflakes={[]} reloadSnowflakes={reloadSnowflakes} />
            </div>
            <div id="matchingSnowflakes">
                <MatchingSnowflakeList snowflakes={matchingSnowflakes} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('snowflake'));
    root.render(<App />);
};

window.onload = init;
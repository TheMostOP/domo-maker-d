const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

console.log("snowflake.jsx");

const handleSnowflake = async (e, onSnowflakeAdded, updateMatchingSnowflakes) => {
    console.log("handleSnowflake");
    e.preventDefault();
    helper.hideError();

    const word = e.target.querySelector('#snowflakeWord').value;
    const user = e.target.querySelector('#snowflakeUser').value;

    if (!word || !user) {
        helper.handleError('All fields are required');
        return false;
    }
 
    try {
        const response = await helper.sendPost(e.target.action, { word, user });
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
    console.log("SnowflakeForm");
    return (
        <form id="snowflakeForm"
            onSubmit={(e) => handleSnowflake(e, props.triggerReload, props.updateMatchingSnowflakes)}
            name="snowflakeForm"
            action="/snowflake"
            method="POST"
            className="snowflakeForm"
        >
            <label htmlFor="word">Word: </label>
            <input id="snowflakeWord" type="text" name="word" placeholder="Type something unique" />
            <label htmlFor="user">User: </label>
            <input id="snowflakeUser" type="text" name="user" placeholder="Enter your username" />
            <input className="playSnowflakeSubmit" type="submit" value="Submit Snowflake" />
        </form>
    );
};

const SnowflakeList = ({ snowflake = [], reloadSnowflakes }) => {
    console.log("SnowflakeList");
    console.log("Props: ", { snowflake, reloadSnowflakes });

    const [snowflakes, setSnowflakes] = useState(snowflake);

    useEffect(() => {
        const loadSnowflakesFromServer = async () => {
            const response = await fetch('/getSnowflakes');
            const data = await response.json();
            setSnowflakes(data.snowflakes || []);
        };
        loadSnowflakesFromServer();
    }, [reloadSnowflakes]);

    if (!snowflakes || snowflakes.length === 0) {
        return (
            <div className="snowflakeList">
                <h3 className="emptySnowflake">No Snowflakes Yet!</h3>
            </div>
        );
    }

    const snowflakeNodes = snowflakes.map((snowflake) => (
        <div key={snowflake.id} className="snowflake">
            <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="snowflakeWord">Word: {snowflake.word}</h3>
            <h3 className="snowflakeUser">Submitted by: {snowflake.owner}</h3>
        </div>
    ));

    return <div className="snowflakeList">{snowflakeNodes}</div>;
};


const MatchingSnowflakeList = (props) => {
    console.log("MatchingSnowflakeList");

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
    console.log("App");
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
    console.log("init");
    const root = createRoot(document.getElementById('snowflake'));
    root.render(<App />);
};

window.onload = init;
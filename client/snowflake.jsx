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

// const DomoList = (props) => {
//     const [domos, setDomos] = useState(props.domos);

//     useEffect(() => {
//         const loadDomosFromServer = async () => {
//             const response = await fetch('/getDomos');
//             const data = await response.json();
//             setDomos(data.domos);
//         };
//         loadDomosFromServer();
//     }, [props.reloadDomos]);

//     if (domos.length === 0) {
//         return (
//             <div className="domoList">
//                 <h3 className="emptyDomo">No Domos Yet!</h3>
//             </div>
//         );
//     }

//     const domoNodes = domos.map(domo => {
//         return (
//             <div key={domo.id} className="domo">
//                 <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
//                 <h3 className="domoName">Name: {domo.name}</h3>
//                 <h3 className="domoAge">Age: {domo.age}</h3>
//                 <h3 className="domoElement">Element: {domo.element}</h3>
//                 <h3 className="domoPublicity">Public? {domo.publicity}</h3>
//             </div>
//         );
//     });

//     return (
//         <div className="domoList">
//             {domoNodes}
//         </div>
//     );
// };

// const PublicDomoList = (props) => {
//     const [domos, setDomos] = useState(props.domos);

//     useEffect(() => {
//         const loadDomosFromServer = async () => {
//             const response = await fetch('/getPublicDomos');
//             const data = await response.json();
//             setDomos(data.domos);
//         };
//         loadDomosFromServer();
//     }, [props.reloadDomos]);

//     if (domos.length === 0) {
//         return (
//             <div className="domoList">
//                 <h3 className="emptyDomo">No Domos Yet!</h3>
//             </div>
//         );
//     }

//     const domoNodes = domos.map(domo => {
//         return (
//             <div key={domo.id} className="domo">
//                 <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
//                 <h3 className="domoName">Name: {domo.name}</h3>
//                 <h3 className="domoAge">Age: {domo.age}</h3>
//                 <h3 className="domoElement">Element: {domo.element}</h3>
//                 <h3 className="domoPublicity">Public? {domo.publicity}</h3>
//             </div>
//         );
//     });

//     return (
//         <div className="domoList">
//             {domoNodes}
//         </div>
//     );
// };

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
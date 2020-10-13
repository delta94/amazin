import React from "react";

function App() {
	const todos = ["Go to market", "Buy food", "Make dinner"];
	const Todos = todos.map((todo) => <li>{todo}</li>);
	return <ul>{Todos}</ul>;
}

export default App;

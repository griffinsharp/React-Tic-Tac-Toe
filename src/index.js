import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// No constructor because Square no longer keeps track of the game's state.
// Functional component makes sense here. No state.
// No need for "this.props.onClick" because in ES6 arrow functions, "this" refers to the same context inside and outside of the function they're defined in. 

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}
    

class Board extends React.Component {

    renderSquare(i) {
        return <Square value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        />;
    }

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0
        };
    }

    handleClick(i) {
        // When clicked, make the history array up to whatever the stepNumber is (index).
        // We slice to stepNumber (slice is exclusive of outer bound).
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // Whatever we set history to on the line above, get the last key/value pair.
        const current = history[history.length - 1];
        // Just get the value of squares of the last key/value pair, or how the array currently appears. 
        const squares = current.squares.slice();
        
        // Looks for a truthy value for whether or not someone has one, or if the square already has a value. If either of these are true, handleClick will return early and not process your click any further. 
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // Use concat as to not mutate the array.
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        // Want to immediately render according to stepNumber, not the history length.
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            // Here move is like our idx.
            // Remember 0 is a falsey value.
            const desc = move ?
            `Go to move #${move}` :
            `Go to game start`;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = `Winner: ${winner}`
        } else {
            status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                    onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    // Either returns a number (truthy) or returns null (falsey). Can use this result in conditional statement for handling clicks. 
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

import React from 'react';
import './assets/style/App.scss';
import Canvas from './components/widgets/canvas';

function App() {
    return (
        <div className='wrapper'>
            <div className='nav-container'></div>
            <div className='main-container'>
                <div className='tool-container'></div>
                <div className='canvas-container'>
                    <Canvas></Canvas>
                </div>
            </div>
        </div>
    );
}

export default App;

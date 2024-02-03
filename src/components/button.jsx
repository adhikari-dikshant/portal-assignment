import React from 'react';
import { convertToRaw } from 'draft-js';
import "../App.css";

const SaveButton = ({ editorState }) => {
    const saveContent = () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState);

        localStorage.setItem('editorState', JSON.stringify(rawContent));
    };

    return (
        <button className="button-13" onClick={saveContent}>Save</button>
    );
};

export default SaveButton;
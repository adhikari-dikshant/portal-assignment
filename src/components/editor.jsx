import React, { useState } from 'react';
import { EditorState, Modifier, RichUtils, getDefaultKeyBinding } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../App.css';
import { convertFromRaw } from 'draft-js';
import SaveButton from './button';

// the whole code is corrected by chat gpt and copilot
const CustomEditor = () => {
    //this part is given by gpt
    //og was this
    {/*    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    }*/}
    const [editorState, setEditorState] = useState(() => {
        const savedState = localStorage.getItem('editorState');
        if (savedState) {
            const rawContent = JSON.parse(savedState);
            const contentState = convertFromRaw(rawContent);
            return EditorState.createWithContent(contentState);
        } else {
            return EditorState.createEmpty();
        }
    });

    const handleKeyCommand = (command, editorState) => {
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const block = contentState.getBlockForKey(selection.getStartKey());
        const text = block.getText();

        if (command === 'toggle-heading') {
            const newContent = Modifier.replaceText(
                contentState,
                selection.merge({
                    anchorOffset: 0,
                    focusOffset: text.length,
                }),
                '',
            );
            let newState = EditorState.push(editorState, newContent, 'remove-range');
            newState = RichUtils.toggleBlockType(newState, 'header-one');
            setEditorState(newState);
            return 'handled';
        } else if (command === 'toggle-bold' || command === 'toggle-red-line' || command === 'toggle-underline') {
            const characterToRemove = command === 'toggle-bold' ? '*' : command === 'toggle-red-line' ? '**' : '***';
            const newContent = Modifier.replaceText(
                contentState,
                selection.merge({
                    anchorOffset: 0,
                    focusOffset: characterToRemove.length,
                }),
                '',
            );
            let newState = EditorState.push(editorState, newContent, 'remove-range');
            newState = RichUtils.toggleInlineStyle(newState, command === 'toggle-bold' ? 'BOLD' : command === 'toggle-red-line' ? 'STRIKETHROUGH' : 'UNDERLINE');
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    //copilot
    const keyBindingFn = (e) => {
        const selection = editorState.getSelection();
        const content = editorState.getCurrentContent();
        const currentBlock = content.getBlockForKey(selection.getStartKey());
        const text = currentBlock.getText();
        if (e.keyCode === 32) {
            if (text.startsWith('***')) {
                return 'toggle-underline';
            } else if (text.startsWith('**')) {
                return 'toggle-red-line';
            } else if (text.startsWith('*')) {
                return 'toggle-bold';
            } else if (text.startsWith('#')) {
                return 'toggle-heading';
            }
        }
        return getDefaultKeyBinding(e);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SaveButton editorState={editorState} />
            </div>
            <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={keyBindingFn}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
            />
        </>

    );
};

export default CustomEditor;
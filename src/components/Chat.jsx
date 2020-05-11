import React from "react";

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iframe: `${process.env.REACT_APP_EMBED_PATH}fvchat.php`
        };
    }

    render() {
        return (
            <div className="chat resize-lock">
                <iframe
                    title="FV Chat Room"
                    src={this.state.iframe}
                    style={{ height: "100%", width: "100%", border: 0 }}
                />
            </div>
        );
    }
}

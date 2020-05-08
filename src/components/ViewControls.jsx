import React, { Component } from "react";
import { connect } from "react-redux";
import { addView, removeView, setActiveView } from "../actions";

// FIXME: Use TypeScript

class _ViewControls extends Component {
    constructor(props) {
        super(props);
        this.state = { xRef: 0, xDiff: 0 };

        // Bind event callbacks
        this.handleMousedown = this.handleMousedown.bind(this);
        this.handleMousemove = this.handleMousemove.bind(this);
        this.handleMouseup = this.handleMouseup.bind(this);

        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.setActive = this.setActive.bind(this);
    }

    add() {
        this.props.add({ src: this.props.src, channel: this.props.channel });
    }

    remove() {
        this.props.remove(this.props.id);
    }

    setActive() {
        this.props.setActive(this.props.id);
    }

    // FIXME: Can this be done without side effects?
    handleMousedown(event) {
        const locks = document.getElementsByClassName("resize-lock");
        for (let lock of locks) {
            lock.style.height = lock.offsetHeight + "px";
        }
        this.setState({ xRef: event.screenX }, () => {
            document.addEventListener("mousemove", this.handleMousemove);
            document.addEventListener("mouseup", this.handleMouseup);
            document.documentElement.classList.add("drag");
        });
    }

    handleMousemove(event) {
        this.setState(
            previousState => {
                const xDiff = event.screenX - previousState.xRef;
                return { xDiff };
            },
            () => this.props.resize(this.state.xDiff)
        );
    }

    handleMouseup() {
        const locks = document.getElementsByClassName("resize-lock");
        for (let lock of locks) {
            lock.style.height = "";
        }
        document.documentElement.classList.remove("drag");
        document.removeEventListener("mousemove", this.handleMousemove);
        document.removeEventListener("mouseup", this.handleMouseup);
        this.props.endResize();
    }

    render() {
        const active = this.props.active ? "active" : "";
        return (
            <div className={`view-controller ${active}`}>
                <i className="material-icons add" onClick={this.add} />
                <i className="material-icons remove" onClick={this.remove} />
                <i className="material-icons star" onClick={this.setActive} />
                <i className="material-icons chat" />
                <i className="material-icons resize" onMouseDown={this.handleMousedown} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setActive: index => dispatch(setActiveView(index)),
    add: data => dispatch(addView(data)),
    remove: index => dispatch(removeView(index))
});

export const ViewControls = connect(
    null,
    mapDispatchToProps
)(_ViewControls);

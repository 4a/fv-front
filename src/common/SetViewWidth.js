export function fitToWidth() {
    document.querySelector('.grid').style.width = "999999999999999px";
}

export function fitToHeight() {
    const available_height = window.innerHeight;
    const viewport_y_offset = document.querySelector('.grid').getBoundingClientRect().top;
    const viewport_height = document.querySelector('.stream-area').getBoundingClientRect().height;
    const viewport_width = document.querySelector('.stream-area').getBoundingClientRect().width;
    const view_aspect_ratio = 16 / 9;
    const bottom_content_height = 200;
    const chat_width = document.querySelector('.chat-area').getBoundingClientRect().width;
    const new_view_height = available_height - (viewport_y_offset + (viewport_height - (viewport_width / view_aspect_ratio)) + bottom_content_height);
    const new_view_width = Math.round(new_view_height * view_aspect_ratio);
    document.querySelector('.grid').style.width = new_view_width + chat_width + "px";
}
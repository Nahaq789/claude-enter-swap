// ReactがaddEventListenerを呼ぶ前にパッチする
const orig = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'keydown' || type === 'keypress') {
        const wrapped = function(e) {
            // contenteditable内でEnter単体のとき → このリスナーをスキップ（送信させない）
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
                const el = document.activeElement;
                if (el && el.getAttribute('contenteditable') === 'true') return;
            }
            return listener.call(this, e);
        };
        return orig.call(this, type, wrapped, options);
    }
    return orig.call(this, type, listener, options);
};

// ReactがaddEventListenerを呼ぶ前にパッチする
const origAdd = EventTarget.prototype.addEventListener;
const origRemove = EventTarget.prototype.removeEventListener;

// 元のリスナー → (type + capture ごとの) ラップ済みリスナー
// removeEventListener で同じラッパーを解除できるよう、また同じリスナーの二重登録を防ぐために保持する
const wrappers = new WeakMap();

const isTarget = (type) => type === 'keydown' || type === 'keypress';
const keyOf = (type, options) => {
    const capture = typeof options === 'boolean' ? options : !!(options && options.capture);
    return `${type}:${capture}`;
};

const wrap = (listener) => function(e) {
    // OFF のときは何もしない（属性が未設定の間は ON 扱い）
    const enabled = document.documentElement.dataset.enterSwap !== 'off';
    // contenteditable内でEnter単体のとき → このリスナーをスキップ（送信させない）
    if (enabled && e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        const el = document.activeElement;
        if (el && el.getAttribute('contenteditable') === 'true') return;
    }
    return typeof listener === 'function'
        ? listener.call(this, e)
        : listener.handleEvent(e);
};

EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (!isTarget(type) || !listener) return origAdd.call(this, type, listener, options);

    let byKey = wrappers.get(listener);
    if (!byKey) wrappers.set(listener, byKey = new Map());
    const key = keyOf(type, options);
    let wrapped = byKey.get(key);
    if (!wrapped) byKey.set(key, wrapped = wrap(listener));
    return origAdd.call(this, type, wrapped, options);
};

EventTarget.prototype.removeEventListener = function(type, listener, options) {
    const wrapped = isTarget(type) && listener && wrappers.get(listener)?.get(keyOf(type, options));
    return origRemove.call(this, type, wrapped || listener, options);
};

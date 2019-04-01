const Config = (function ConfigModule() {
    var _active = false;
    var _main = document.querySelector(".fv-main");
    var _drawer, _burger, _burgerType;
    var _burgerTypes = [
        // "hamburger--3dx",
        // "hamburger--3dx-r",
        // "hamburger--3dy",
        // "hamburger--3dy-r",
        // "hamburger--3dxy",
        // "hamburger--3dxy-r",
        // "hamburger--arrow",
        // "hamburger--arrow-r",
        // "hamburger--arrowalt",
        // "hamburger--arrowalt-r",
        // "hamburger--arrowturn",
        // "hamburger--arrowturn-r",
        // "hamburger--boring",
        "hamburger--collapse",
        "hamburger--collapse-r",
        "hamburger--elastic",
        "hamburger--elastic-r",
        "hamburger--emphatic",
        "hamburger--emphatic-r",
        // "hamburger--minus",
        "hamburger--slider",
        "hamburger--slider-r",
        "hamburger--spin",
        "hamburger--spin-r",
        "hamburger--spring",
        "hamburger--spring-r",
        "hamburger--stand",
        "hamburger--stand-r",
        "hamburger--squeeze",
        "hamburger--vortex",
        "hamburger--vortex-r"
    ];

    function init(parent) {
        _drawer = parent.querySelector(".drawer");
        _burger = parent.querySelector(".hamburger");
        _burgerType = _burger.className.match(/hamburger--\S*/)[0] || "hamburger--collapse";
        applyBurgerClicks();
    }

    function applyBurgerClicks() {
        _burger.addEventListener("click", handleBurgerClicks);
    }

    function handleBurgerClicks() {
        console.log(_burgerType);
        var i = getRandomWithinRange(0, _burgerTypes.length);
        var newType = _burgerTypes[i];
        if (_active) {
            swapClass(_burger.classList, "is-active", "not-active");
        } else {
            swapClass(_burger.classList, _burgerType, newType);
            _burgerType = newType;
            swapClass(_burger.classList, "not-active", "is-active");
        }
        toggleDrawer();
        _active = !_active;
    }

    function toggleDrawer() {
        if (_active) {
            swapClass(_drawer.classList, "is-active", "not-active");
            swapClass(_main.classList, "push", "default");
        } else {
            swapClass(_drawer.classList, "not-active", "is-active");
            swapClass(_main.classList, "default", "push");
        }
    }

    return {
        init
    };
})();

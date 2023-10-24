// by https://github.com/SaltyAom/jing-p
const load = <T extends HTMLElement = HTMLElement>(id: string) => {
    return document.getElementById(id) as T;
};

// by https://github.com/SaltyAom/jing-p
const on = <Event extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    event: Event,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[Event]) => unknown
) => element.addEventListener(event, callback);

const addOption = (select: HTMLSelectElement, value: string, label: string) => {
    const option = document.createElement("option") as HTMLOptionElement;
    option.text = label;
    option.value = value;

    select.add(option);
};

const createVideoTrack = (id: string): MediaTrackConstraints => ({
    deviceId: id,
    aspectRatio: 16 / 9,
    width: 2560,
    height: 1440,
});

const createAudioTrack = (id: string): MediaTrackConstraints => ({
    deviceId: id,
});

document.addEventListener("DOMContentLoaded", () => {
    const screen = load("screen");
    const videoElement = load<HTMLVideoElement>("video");
    const videoSelect = load<HTMLSelectElement>("video-select");
    const audioSelect = load<HTMLSelectElement>("audio-select");

    const settingPopup = load("setting-popup");
    const closeSettingBtn = load<HTMLButtonElement>("close-setting-btn");
    const openSettingBtn = load<HTMLButtonElement>("open-setting-btn");

    const menu = load("menu");
    const volumeInput = load<HTMLInputElement>("volume-input");
    const fullscreenBtn = load<HTMLInputElement>("fullscreen-btn");

    let fullscreen = false;

    const getDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();

        devices.forEach((device) => {
            if (device.kind === "videoinput")
                addOption(videoSelect, device.deviceId, device.label);
            else if (device.kind === "audioinput")
                addOption(audioSelect, device.deviceId, device.label);

            console.log(device.deviceId, device.label);
        });

        volumeInput.value = localStorage.getItem("volume") || "100";
        volumeInput.style.setProperty("--volume", `${volumeInput.value}%`);
    };

    getDevices();

    const update = async () => {
        const video = videoSelect.value;
        const audio = audioSelect.value;

        if (!video && !audio) {
            videoElement.srcObject = null;
            menu.classList.remove("opacity-0");
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: video ? createVideoTrack(videoSelect.value) : false,
            audio: audio ? createAudioTrack(audioSelect.value) : false,
        });

        videoElement.srcObject = stream;
        videoElement.volume = Number(volumeInput.value) / 100;

        if (video) menu.classList.add("opacity-0");
    };

    on(videoSelect, "change", () => update());

    on(audioSelect, "change", () => update());

    on(closeSettingBtn, "click", () => {
        settingPopup.classList.remove("open");
        settingPopup.classList.add("close");
    });

    on(openSettingBtn, "click", () => {
        settingPopup.classList.add("open");
        settingPopup.classList.remove("close");
    });

    on(volumeInput, "input", () => {
        volumeInput.style.setProperty("--volume", `${volumeInput.value}%`);
        videoElement.volume = Number(volumeInput.value) / 100;
    });

    on(volumeInput, "change", () => {
        localStorage.setItem("volume", volumeInput.value);
    });

    on(fullscreenBtn, "click", () => {
        fullscreen = !fullscreen;

        if (fullscreen) {
            screen.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
});

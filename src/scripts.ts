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
    width:1920,
    height:1080
});

const createAudioTrack = (id: string): MediaTrackConstraints => ({
    deviceId: id,
});

const getPermission = async () => {
    const microphone = navigator.permissions.query({
        name: "microphone" as PermissionName,
    });
    const camera = navigator.permissions.query({
        name: "camera" as PermissionName,
    });

    const result = await Promise.all([microphone, camera]);

    if (result[0].state === "prompt" && result[1].state === "prompt") {
        const devices = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        devices.getTracks().forEach((track) => track.stop());
    }
};

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
    let stream: MediaStream | null = null;

    const getDevices = async () => {
        await getPermission();

        const devices = await navigator.mediaDevices.enumerateDevices();

        devices.forEach((device) => {
            if (device.kind === "videoinput")
                addOption(videoSelect, device.deviceId, device.label);
            else if (device.kind === "audioinput")
                addOption(audioSelect, device.deviceId, device.label);
        });
    };

    const update = async () => {
        const video = videoSelect.value;
        const audio = audioSelect.value;

        stream?.getTracks().forEach((t) => t.stop());

        if (!video && !audio) {
            videoElement.srcObject = null;
            menu.classList.remove("opacity-0");
            return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
            video: video ? createVideoTrack(videoSelect.value) : false,
            audio: audio ? createAudioTrack(audioSelect.value) : false,
        });

        videoElement.srcObject = stream;
        videoElement.volume = Number(volumeInput.value) / 100;

        if (video) menu.classList.add("opacity-0");
    };

    volumeInput.value = localStorage.getItem("volume") || "100";
    volumeInput.style.setProperty("--volume", `${volumeInput.value}%`);
    getDevices();

    on(videoSelect, "change", () => update());

    on(audioSelect, "change", () => update());

    on(closeSettingBtn, "click", () => {
        settingPopup.classList.remove("open");
        settingPopup.classList.add("close");
    });

    on(openSettingBtn, "click", () => {
        settingPopup.classList.remove("close");
        settingPopup.classList.add("open");
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

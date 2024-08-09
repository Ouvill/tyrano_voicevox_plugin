// TypeScript Type Definitions for TyranoScript
// 
// 以下のファイルを参考にしています。
// https://github.com/ShikemokuMK/tyranoscript/blob/c763ee2913307fd90f09461c98c2cc1efd2e481b/tyrano/plugins/kag/kag.js
import "jquery";

declare namespace tyrano {
    namespace plugin {
        namespace kag {
            interface KAG {
                version: number;
                tyrano: any;
                kag: KAG;
                sound_swf: any;
                lang: string;
                map_lang: Record<string, any>;
                is_rider: boolean;
                is_studio: boolean;
                save_key_id: string;
                save_key_val: string;
                cache_html: Record<string, any>;
                cache_scenario: Record<string, any>;
                event_listener_map: Record<string, any>;
                array_white_attr: string[];
                config: {
                    defaultStorageExtension: string;
                    projectID: string;
                    game_version: string;
                    preload: string;
                    skipSpeed: string;
                    patch_apply_auto: string;
                    mediaFormatDefault: string;
                    configSave: string;
                    configSaveOverwrite: string;
                    [key: string]: string;
                };
                define: {
                    TYRANO_ENGINE_VERSION: number;
                    BASE_DIV_NAME: string;
                    FLAG_APRI: boolean;
                };
                variable: {
                    sf: Record<string, any>;
                    tf: Record<string, any>;
                };
                tmp: {
                    checking_macro: boolean;
                    ready_audio: boolean;
                    audio_context: boolean;
                    num_anim: number;
                    map_bgm: Record<string, any>;
                    map_se: Record<string, any>;
                    sleep_game: any;
                    sleep_game_next: boolean;
                    base_scale: number;
                    is_se_play: boolean;
                    is_se_play_wait: boolean;
                    is_vo_play: boolean;
                    is_vo_play_wait: boolean;
                    is_bgm_play: boolean;
                    is_bgm_play_wait: boolean;
                    loading_make_ref: boolean;
                    cut_nextorder: any;
                    wait_id: string;
                    map_chara_talk_top: Record<string, any>;
                    camera_stream: boolean;
                    video_playing: boolean;
                    angle: number;
                    largerWidth: boolean;
                    [key: string]: any;
                };
                stat: {
                    map_label: Record<string, any>;
                    map_macro: Record<string, any>;
                    vertical: string;
                    f: Record<string, any>;
                    mp: Record<string, any>;
                    current_layer: string;
                    current_page: string;
                    is_stop: boolean;
                    is_wait: boolean;
                    is_trans: boolean;
                    is_wait_anim: boolean;
                    is_strong_stop: boolean;
                    strong_stop_recover_index: number;
                    is_nowait: boolean;
                    current_message_str: string;
                    current_save_str: string;
                    current_keyframe: string;
                    map_keyframe: Record<string, any>;
                    is_script: boolean;
                    buff_script: string;
                    is_html: boolean;
                    map_html: Record<string, any>;
                    cssload: Record<string, any>;
                    save_img: string;
                    stack: {
                        if: any[];
                        call: any[];
                        macro: any[];
                    };
                    set_text_span: boolean;
                    current_scenario: string;
                    is_skip: boolean;
                    is_auto: boolean;
                    current_bgm: string;
                    current_bgm_vol: string;
                    current_bgm_html5: string;
                    current_bgm_base64: string;
                    current_bgm_pause_seek: string;
                    current_se: Record<string, any>;
                    load_auto_next: boolean;
                    current_bgcamera: string;
                    enable_keyconfig: boolean;
                    current_bgmovie: {
                        storage: string;
                        volume: string;
                    };
                    current_camera: Record<string, any>;
                    current_camera_layer: string;
                    is_move_camera: boolean;
                    is_wait_camera: boolean;
                    current_line: number;
                    is_hide_message: boolean;
                    is_click_text: boolean;
                    is_adding_text: boolean;
                    flag_ref_page: boolean;
                    ruby_str: string;
                    mark: number;
                    style_mark: string;
                    ch_speed: string;
                    skip_link: string;
                    log_join: string;
                    log_clear: boolean;
                    f_chara_ptext: string;
                    flag_glyph: string;
                    path_glyph: string;
                    current_cursor: string;
                    use_close_confirm: boolean;
                    font: {
                        enable: boolean;
                        color: string;
                        bold: string;
                        size: string;
                        face: string;
                        italic: string;
                        effect: string;
                        effect_speed: string;
                        edge_method: string;
                    };
                    qr: {
                        mode: string;
                        define: Record<string, any>;
                    };
                    locate: {
                        x: number;
                        y: number;
                    };
                    default_font: {
                        color: string;
                        bold: string;
                        size: string;
                        face: string;
                        italic: string;
                        edge: string;
                        shadow: string;
                        effect: string;
                        effect_speed: string;
                        edge_method: string;
                    };
                    fuki: {
                        def_style: Record<string, any>;
                        def_style_inner: Record<string, any>;
                        def_pm: Record<string, any>;
                        active: boolean;
                        marginr: number;
                        marginb: number;
                        others_style: Record<string, any>;
                    };
                    sysview: {
                        save: string;
                        load: string;
                        backlog: string;
                        menu: string;
                    };
                    chara_pos_mode: string;
                    chara_effect: string;
                    chara_ptext: string;
                    chara_time: string;
                    chara_memory: string;
                    chara_anim: string;
                    pos_change_time: string;
                    chara_last_zoom_name: string;
                    chara_talk_focus: string;
                    chara_brightness_value: string;
                    chara_blur_value: string;
                    chara_talk_anim: string;
                    chara_talk_anim_time: number;
                    chara_talk_anim_value: number;
                    chara_talk_anim_zoom_rate: number;
                    apply_filter_str: string;
                    video_stack: any;
                    is_wait_bgmovie: boolean;
                    charas: Record<string, any>;
                    jcharas: Record<string, any>;
                    play_bgm: boolean;
                    play_se: boolean;
                    play_speak: boolean;
                    map_se_volume: Record<string, any>;
                    map_bgm_volume: Record<string, any>;
                    map_vo: {
                        vobuf: Record<string, any>;
                        vochara: Record<string, any>;
                    };
                    vostart: boolean;
                    log_write: boolean;
                    buff_label_name: string;
                    already_read: boolean;
                    visible_menu_button: boolean;
                    resizecall: {
                        storage: string;
                        target: string;
                    };
                    vchat: {
                        is_active: boolean;
                        chara_name_color: string;
                        max_log_count: number;
                        charas: Record<string, any>;
                    };
                    message_config: Record<string, any>;
                    word_nobreak_list: string[];
                    lipsync_buf_chara: Record<string, any>;
                    title: string;
                };
                parser: any;
                ftag: FTag;
                layer: any;
                menu: any;
                key_mouse: any;
                event: any;
                rider: any;
                studio: any;
                chara: Chara;

                init(): void;
                checkUpdate(call_back: () => void): void;
                applyPatch(patch_path: string, flag_reload: string, call_back: () => void): void;
                evalScript(str: string): void;
                embScript(str: string, preexp: any): any;
                removeSaveData(): void;
                saveSystemVariable(): void;
                clearVariable(): void;
                clearTmpVariable(): void;
                pushStack(name: string, flag: any): void;
                popStack(name: string): any;
                getStack(name: string): any;
                setStack(name: string, flag: any): void;
                endStorage(): boolean;
                setCacheScenario(filename: string, str: string): void;
                getMessageInnerLayer(): JQuery;
                getMessageOuterLayer(): JQuery;
                getMessageCurrentSpan(): JQuery;
                setMessageCurrentSpan(): JQuery;
                setNewParagraph(j_inner: JQuery): void;
                checkMessage(jtext: JQuery): void;
                appendMessage(jtext: JQuery, str: string): void;
                preload(src: string, callbk: (elm: any) => void, options?: Record<string, any>): void;
                preloadAll(storage: string | string[], callbk: () => void): void;
                preloadNextVoice(): void;
                setStyles(j_obj: JQuery, array_style: Record<string, any>): JQuery;
                html(html_file_name: string, data: Record<string, any>, callback: (html: JQuery) => void): void;
                error(message: string, replace_map: Record<string, any>): void;
                warning(message: string, replace_map: Record<string, any>, is_alert?: boolean): void;
                log(obj: any): void;
                setAuto(bool: boolean): void;
                setSkip(bool: boolean, options?: Record<string, any>): void;
                weaklyStop(): void;
                cancelWeakStop(): void;
                stronglyStop(): void;
                cancelStrongStop(): void;
                waitClick(name: string): void;
                logTrigger(event_name: string, event_obj: Record<string, any>): void;
                enableEventLogging(): void;
                logEventLisnenerCount(): void;
                trigger(event_name: string, event_obj?: Record<string, any>): void;
                on(event_names: string, callback: (event_obj: Record<string, any>) => void, options?: Record<string, any>): void;
                once(event_names: string, callback: (event_obj: Record<string, any>) => void, options?: Record<string, any>): void;
                overwrite(event_names: string, callback: (event_obj: Record<string, any>) => void, options?: Record<string, any>): void;
                sortEventLisneners(evnet_name: string): void;
                off(event_names: string, options?: Record<string, any>): void;
                offTempListeners(): void;
                getTag(tag_name?: string): any;
                parseKeyframesForWebAnimationAPI(name: string): any[] | null;
                getHiddenArea(): JQuery;
                changeHowlVolume(audio_obj: any, options?: Record<string, any>): void;
                playSound(storage: string, buf: string): void;
                makeFocusable(j_elm: JQuery, tabindex?: number | string): void;
                makeUnfocusable(j_elm: JQuery): void;
                makeUnfocusableAll(j_elm: JQuery): void;
                unfocus(): void;
                restoreFocusable(): void;
                showModeEffect(_type: "skip" | "stop" | "auto", options?: Record<string, any>): void;
                showLoadingLog(type?: "preload" | "save"): void;
                hideLoadingLog(): void;
                convertLang(scenario: string, array_s: any[]): any[];
                loadLang(name: string, cb: () => void): Promise<void>;
                test(): void;
            }
        }
    }

    interface FTag {
        master_tag: Record<string, Tag>;
        array_tag: any[];
        current_order_index: number;

        init(): void;
        buildTag(array_tag: any[]): void;
        startTag(key: string, pm: Record<string, any>): void;
        nextOrder(): void;
        pushTag(tag: any): void;
        getCurrentTag(): any;
        jumpTag(index: number): void;
        processStart(): void;
        cutTag(start: number, end: number): void;
        startSync(array_tag: any[], index: number): void;
        objectConvert(tag_obj: any, line: number): any;
        convertEntity(str: string): string;
        checkCond(str: string): boolean;
        checkVital(tag: Tag): boolean;
        getTagObject(tag_name: string): Tag;
        setMenuEvent(j_obj: JQuery, caller: any): void;
    }

    interface Tag {
        vital: string[];
        pm: Record<string, any>;
        start(pm: Record<string, any>): void;
    }

    interface Chara {
        kag: KAG;
        init(): void;
        getCharaNameArea(): JQuery;
        getCharaName(convert_to_id?: boolean): string;
        setNotSpeakerStyle(j_chara: JQuery): void;
        setSpeakerStyle(j_chara: JQuery): void;
        isPlusLighterEnabled(): boolean;
        getCharaContainer(chara_name?: string, j_layer?: JQuery): JQuery;
        setPartContainer(j_chara: JQuery): void;
        wrapPartContainer(j_img: Element | JQuery): void;
        getLipSyncParts(name: string, type?: "voice" | "text"): Array<{
            j_frames: JQuery;
            thresholds: number[];
        }> | null;
        getFrameAnimationSrcs(cpm: CharaDefinition, part: string, state: string): string[];
        setFrameAnimation(cpm: CharaDefinition, part: string, state: string, j_frame_base: JQuery, preload_srcs: string[]): JQuery | null;
        startFrameAnimation(state_obj: PartStateDefinition, j_frames: JQuery): void;
        stopFrameAnimation(cpm: CharaDefinition): void;
        stopAllFrameAnimation(): void;
        restoreAllFrameAnimation(): void;
        updateLipSyncWithVoice(value: number, target_parts: Array<{
            j_frames: JQuery;
            thresholds: number[];
            current_index?: number;
        }>, elapsed_time: number): void;
    }
}
declare global {
    const TYRANO: tyrano.plugin.kag.KAG;
    interface Window { TYRANO: typeof TYRANO; }
}

export { };

export type MacroStep =
    | { type: 'command'; command: string }
    | { type: 'insert'; text: string };

export class MacroRecorder {
    private recording = false;
    private playing = false;
    private steps: MacroStep[] = [];

    isRecording(): boolean {
        return this.recording;
    }

    isPlaying(): boolean {
        return this.playing;
    }

    setPlaying(playing: boolean): void {
        this.playing = playing;
    }

    start(): void {
        this.steps = [];
        this.recording = true;
    }

    stop(): MacroStep[] {
        this.recording = false;
        return [...this.steps];
    }

    cancel(): void {
        this.recording = false;
        this.steps = [];
    }

    record(step: MacroStep): void {
        if (this.recording && !this.playing) {
            this.steps.push(step);
        }
    }

    get stepCount(): number {
        return this.steps.length;
    }
}

export const macroRecorder = new MacroRecorder();

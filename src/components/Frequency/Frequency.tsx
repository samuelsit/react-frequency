import React, { useCallback, useEffect, useState } from 'react';
import { UseStateCallback } from '../../hooks/UseStateCallback';

interface IFrequency {
	type?: 'center' | 'left' | 'right';
	oscillator?: 'sine' | 'square' | 'sawtooth' | 'triangle';
	gain?: number;
	hz: number;
	onStart?: CallableFunction;
	onStop?: CallableFunction;
}

const Frequency = ({
	type = 'center',
	oscillator = 'sine',
	gain = 1,
	hz,
	onStart,
	onStop,
}: IFrequency) => {
	const [contextAudio, setContextAudio] = UseStateCallback(null);
	const [o, setO] = useState<OscillatorNode | null>(null);
	const [gl, setGl] = useState<GainNode | null>(null);
	const [gr, setGr] = useState<GainNode | null>(null);
	const [merger, setMerger] = useState<ChannelMergerNode | null>(null);

	const start = useCallback(() => {
		if (!contextAudio) {
			setContextAudio(new AudioContext(), (c: AudioContext) => {
				c.resume().then(() => {
					setO(c.createOscillator());
					setGl(c.createGain());
					setGr(c.createGain());
					setMerger(c.createChannelMerger(2));
				});
			});
		}
	}, [contextAudio, setContextAudio]);

	const stop = useCallback(() => {
		if (contextAudio) {
			contextAudio.close();
			setContextAudio(null);
			setO(null);
			setGl(null);
			setGr(null);
			setMerger(null);
		}
	}, [contextAudio, setContextAudio]);

	useEffect(() => {
		if (!onStart) start();
		return () => {
			if (!onStop) stop();
		};
	}, [start, stop, onStart, onStop]);

	useEffect(() => {
		if (onStart) {
			onStart(start());
		}
	}, [onStart]);

	useEffect(() => {
		if (onStop) {
			onStop(stop());
		}
	}, [onStop]);

	useEffect(() => {
		if (contextAudio?.destination && gr && gl && o && merger) {
			o.connect(gl);
			o.connect(gr);
			gr.connect(merger, 0, 1);
			gl.connect(merger, 0, 0);
			merger.connect(contextAudio?.destination);
			o.start(0);
		}
	}, [contextAudio?.destination, gr, gl, o, merger]);

	useEffect(() => {
		if (o && hz) o.frequency.value = hz;
	}, [hz, o]);

	useEffect(() => {
		if (o && oscillator) o.type = oscillator;
	}, [oscillator, o]);

	useEffect(() => {
		if (gl) gl.gain.value = type === 'left' || type === 'center' ? gain : 0;
		if (gr) gr.gain.value = type === 'right' || type === 'center' ? gain : 0;
	}, [type, gain, gl, gr]);

	return <></>;
};

export default Frequency;

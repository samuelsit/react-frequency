import React, { useCallback, useEffect, useState } from 'react';
import { UseStateCallback } from '../../hooks/UseStateCallback';

interface IFrequency {
	type: 'center' | 'left' | 'right';
	gain: number;
	frequency: number;
}

const Frequency = ({ type, gain, frequency }: IFrequency) => {
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
		if (gain >= 0 && gain <= 1) start();
		return () => {
			stop();
		};
	}, [start, stop]);

	useEffect(() => {
		if (contextAudio && contextAudio.destination && gr && gl && o && merger) {
			o.type = 'sine';
			o.connect(gl);
			o.connect(gr);
			gr.connect(merger, 0, 1);
			gl.connect(merger, 0, 0);
			merger.connect(contextAudio.destination);
			o.start(0);
		}
	}, [contextAudio, gr, gl, o, merger]);

	useEffect(() => {
		if (o) o.frequency.value = frequency;
	}, [frequency, o]);

	useEffect(() => {
		if (gl) gl.gain.value = type === 'left' || type === 'center' ? gain : 0;
		if (gr) gr.gain.value = type === 'right' || type === 'center' ? gain : 0;
	}, [type, gain, gl, gr]);

	return <></>;
};

export default Frequency;

import React, { useEffect, useRef, useState } from 'react';
import IFrequency from '../../interface/IFrequency';

function useFrequency({
	type = 'center',
	oscillator = 'sine',
	gain = 1,
	hz,
}: IFrequency) {
	const [playing, setPlaying] = useState(false);
	const ctxRef = useRef<AudioContext>();
	const o = useRef<OscillatorNode>();
	const gL = useRef<GainNode>();
	const gR = useRef<GainNode>();

	useEffect(() => {
		const AudioContext = window.AudioContext || window.webkitAudioContext;

		const ctx = new AudioContext();
		const oscillator = ctx.createOscillator();
		const gainL = ctx.createGain();
		const gainR = ctx.createGain();
		const m = ctx.createChannelMerger(2);

		oscillator.connect(gainL);
		oscillator.connect(gainR);
		gainR.connect(m, 0, 1);
		gainL.connect(m, 0, 0);
		m.connect(ctx.destination);
		oscillator.start();

		o.current = oscillator;
		gL.current = gainL;
		gR.current = gainR;

		ctxRef.current = ctx;
		ctx.suspend();

		return () => {
			m.disconnect(ctx.destination);
			ctx.close();
		};
	}, []);

	useEffect(() => {
		if (o.current) o.current.type = oscillator;
	}, [oscillator]);

	useEffect(() => {
		if (o.current) o.current.frequency.value = hz;
	}, [hz]);

	useEffect(() => {
		if (gL.current)
			gL.current.gain.value = type === 'left' || type === 'center' ? gain : 0;
		if (gR.current)
			gR.current.gain.value = type === 'right' || type === 'center' ? gain : 0;
	}, [type, gain]);

	const toggle = () => {
		if (playing) ctxRef.current?.suspend();
		else ctxRef.current?.resume();
		setPlaying((play) => !play);
	};

	const start = () => {
		if (!playing) ctxRef.current?.resume();
		setPlaying(true);
	};

	const stop = () => {
		if (playing) ctxRef.current?.suspend();
		setPlaying(false);
	};

	return { toggle, start, stop, playing };
}

export default useFrequency;

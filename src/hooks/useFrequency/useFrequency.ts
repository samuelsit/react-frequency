import React, { useEffect, useRef, useState } from 'react';
import IFrequency from '../../interface/IFrequency';

const AudioContext = window.AudioContext || window.webkitAudioContext;

function useFrequency({
	type = 'center',
	oscillator = 'sine',
	gain = 1,
	hz = 174,
}: IFrequency) {
	const [playing, setPlaying] = useState(false);
	const ctxRef = useRef<AudioContext>();

	useEffect(() => {
		const ctx = new AudioContext();
		const o = ctx.createOscillator();
		const gL = ctx.createGain();
		const gR = ctx.createGain();
		const m = ctx.createChannelMerger(2);

		o.type = oscillator;
		o.frequency.value = hz;
		gL.gain.value = type === 'left' || type === 'center' ? gain : 0;
		gR.gain.value = type === 'right' || type === 'center' ? gain : 0;

		o.connect(gL);
		o.connect(gR);
		gR.connect(m, 0, 1);
		gL.connect(m, 0, 0);
		m.connect(ctx.destination);
		o.start();

		ctxRef.current = ctx;
		ctx.suspend();

		return () => o.disconnect(ctx.destination);
	}, [hz, type, oscillator, gain]);

	const toggle = () => {
		if (playing) {
			ctxRef.current?.suspend();
		} else {
			ctxRef.current?.resume();
		}
		setPlaying((play) => !play);
	};

	const start = () => {
		if (!playing) {
			ctxRef.current?.resume();
		}
		setPlaying(true);
	};

	const stop = () => {
		if (playing) {
			ctxRef.current?.suspend();
		}
		setPlaying(false);
	};

	return { toggle, start, stop };
}

export default useFrequency;

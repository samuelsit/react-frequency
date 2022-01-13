import React, { useEffect } from 'react';
import useFrequency from '../../hooks/useFrequency/useFrequency';
import IFrequency from '../../interface/IFrequency';

const Frequency = ({
	type = 'center',
	oscillator = 'sine',
	gain = 1,
	hz = 174,
}: IFrequency) => {
	const { start, stop } = useFrequency({
		type,
		oscillator,
		gain,
		hz,
	});

	useEffect(() => {
		start();
		return () => {
			stop();
		};
	}, [start, stop]);

	return <></>;
};

export default Frequency;

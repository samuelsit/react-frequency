export default interface IFrequency {
	type?: 'center' | 'left' | 'right';
	oscillator?: 'sine' | 'square' | 'sawtooth' | 'triangle';
	gain?: number;
	hz: number;
}

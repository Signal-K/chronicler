import { useColorScheme as rnUseColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscribe as subscribeTheme, getOverride } from './themeManager';

export function useColorScheme() {
	const system = rnUseColorScheme();
	const [theme, setTheme] = useState<string>(() => {
		const ov = getOverride();
		return ov ?? system ?? 'light';
	});

	useEffect(() => {
		let mounted = true;

		AsyncStorage.getItem('darkMode').then((val) => {
			if (!mounted) return;
			if (val !== null) {
				setTheme(val === 'true' ? 'dark' : 'light');
			} else {
				setTheme(system ?? 'light');
			}
		}).catch(() => {
			if (mounted) setTheme(system ?? 'light');
		});

		const unsub = subscribeTheme(() => {
			const ov = getOverride();
			setTheme(ov ?? system ?? 'light');
		});

		return () => {
			mounted = false;
			unsub();
		};
	}, [system]);

	return theme;
}

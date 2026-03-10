import { useState, useEffect } from "react";
import type { PluginRuntime, RuntimeStatusBarItem } from "./PluginRuntime";
import type { PluginCommandContribution, PluginPanelContribution } from "./types";

export function usePluginRuntime(runtime: PluginRuntime | null) {
	const [commands, setCommands] = useState<(PluginCommandContribution & { pluginId: string; pluginName: string })[]>([]);
	const [panels, setPanels] = useState<(PluginPanelContribution & { pluginId: string })[]>([]);
	const [statusBarItems, setStatusBarItems] = useState<RuntimeStatusBarItem[]>([]);
	const [pluginsWithSettings, setPluginsWithSettings] = useState<{ pluginId: string; pluginName: string }[]>([]);

	useEffect(() => {
		if (!runtime) return;

		const refresh = () => {
			setCommands(runtime.getAllCommands());
			setPanels(runtime.getAllPanels());
			setStatusBarItems(runtime.getAllStatusBarItems());
			setPluginsWithSettings(runtime.getPluginsWithSettings());
		};

		// Initial load
		refresh();

		// Subscribe to changes
		return runtime.subscribe(refresh);
	}, [runtime]);

	return { commands, panels, statusBarItems, pluginsWithSettings, runtime };
}

import "../styles/components/PluginUpdateBanner.css";
import { useState } from "react";
import type { PluginUpdater, PluginUpdateInfo } from "../hooks/usePluginUpdateChecker";

const PuzzleIcon = () => (
	<svg viewBox="0 0 24 24" width="16" height="16">
		<path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.5 2.5 0 1 0-3.214 3.214c.446.166.855.497.925.968a.98.98 0 0 1-.276.837l-1.61 1.611a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.878-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.878L2.292 13.44A2.404 2.404 0 0 1 1.586 11.735c0-.617.236-1.234.706-1.704L3.903 8.42a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.5 2.5 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.98.98 0 0 1 .276-.837l1.611-1.611a2.404 2.404 0 0 1 1.704-.706c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.878.29.493-.075.84-.505 1.02-.969a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z" />
	</svg>
);

const CheckIcon = () => (
	<svg viewBox="0 0 24 24" width="16" height="16">
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

interface PluginUpdateBannerProps {
	updater: PluginUpdater;
}

export function PluginUpdateBanner({ updater }: PluginUpdateBannerProps) {
	const [expanded, setExpanded] = useState(false);
	const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
	const [updatingAll, setUpdatingAll] = useState(false);

	const {
		updatesAvailable,
		dismissed,
		updateResults,
		autoUpdated,
		dismissAll,
		ignoreVersion,
		updatePlugin,
		updateAll,
		clearResults,
	} = updater;

	const hasUpdates = updatesAvailable.length > 0;
	const hasResults = updateResults.length > 0;

	// Don't render if dismissed and no results to show
	if (dismissed && !hasResults) return null;
	// Don't render if nothing to show
	if (!hasUpdates && !hasResults) return null;

	const handleUpdatePlugin = async (plugin: PluginUpdateInfo) => {
		setUpdatingIds((prev) => new Set(prev).add(plugin.id));
		await updatePlugin(plugin);
		setUpdatingIds((prev) => {
			const next = new Set(prev);
			next.delete(plugin.id);
			return next;
		});
	};

	const handleUpdateAll = async () => {
		setUpdatingAll(true);
		await updateAll();
		setUpdatingAll(false);
		setExpanded(false);
	};

	const handleSkip = async (plugin: PluginUpdateInfo) => {
		await ignoreVersion(plugin.id, plugin.newVersion);
	};

	// ─── Post-update / auto-update results state ─────
	if (hasResults) {
		const successCount = updateResults.filter((r) => r.success).length;
		return (
			<div className="pub">
				<div className="pub-bar pub-bar-success">
					<span className="pub-icon pub-icon-success"><CheckIcon /></span>
					<span className="pub-text">
						{autoUpdated
							? `${successCount} plugin${successCount !== 1 ? "s were" : " was"} automatically updated`
							: `${successCount} plugin${successCount !== 1 ? "s" : ""} updated successfully`
						}
					</span>
					<div className="pub-actions">
						<button className="pub-btn" onClick={() => setExpanded(!expanded)}>
							{expanded ? "Collapse" : "See Changes"}
						</button>
						<button className="pub-btn" onClick={clearResults}>Dismiss</button>
					</div>
				</div>
				{expanded && (
					<div className="pub-details">
						{updateResults.map((r) => (
							<div key={r.id} className="pub-detail-row">
								<span className={`pub-result-dot ${r.success ? "pub-result-success" : "pub-result-fail"}`} />
								<span className="pub-detail-name">{r.name}</span>
								<span className="pub-detail-status">
									{r.success ? "Updated" : "Failed"}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	// ─── Updates available state ─────
	return (
		<div className="pub">
			<div className="pub-bar">
				<span className="pub-icon"><PuzzleIcon /></span>
				<span className="pub-text">
					Plugin updates available: {updatesAvailable.length} plugin{updatesAvailable.length !== 1 ? "s" : ""}
				</span>
				<div className="pub-actions">
					{!updatingAll && (
						<>
							<button className="pub-btn pub-btn-primary" onClick={handleUpdateAll}>
								Update All
							</button>
							<button className="pub-btn" onClick={() => setExpanded(!expanded)}>
								{expanded ? "Collapse" : "Details"}
							</button>
							<button className="pub-btn" onClick={dismissAll}>Later</button>
						</>
					)}
					{updatingAll && (
						<span className="pub-spinner-text">
							<span className="pub-spinner" />
							Updating...
						</span>
					)}
					{!updatingAll && (
						<button className="pub-close" onClick={dismissAll}>&times;</button>
					)}
				</div>
			</div>
			{expanded && !updatingAll && (
				<div className="pub-details">
					{updatesAvailable.map((plugin) => {
						const isUpdating = updatingIds.has(plugin.id);
						return (
							<div key={plugin.id} className="pub-detail-row">
								<div className="pub-detail-info">
									<span className="pub-detail-name">{plugin.name}</span>
									<span className="pub-detail-version">
										v{plugin.currentVersion} &rarr; v{plugin.newVersion}
									</span>
								</div>
								<div className="pub-detail-actions">
									{isUpdating ? (
										<span className="pub-spinner-text">
											<span className="pub-spinner" />
										</span>
									) : (
										<>
											<button className="pub-btn pub-btn-sm pub-btn-primary" onClick={() => handleUpdatePlugin(plugin)}>
												Update
											</button>
											<button className="pub-btn pub-btn-sm" onClick={() => handleSkip(plugin)}>
												Skip
											</button>
										</>
									)}
								</div>
								{plugin.changelog && plugin.changelog.length > 0 && (
									<div className="pub-detail-changelog">
										{plugin.changelog
											.filter((e) => e.version === plugin.newVersion)
											.flatMap((e) => e.changes)
											.map((change, i) => (
												<div key={i} className="pub-detail-change">&middot; {change}</div>
											))
										}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Card, CardBody } from 'reactstrap';

function parseFileExtension(name) {
	return name && [...name].includes('.') ? name.split('.').slice(-1)[0] : null;
}

function directorySortComparator(a, b) {
	const A = +Boolean(a.entries);
	const B = +Boolean(b.entries);
	return A === B ? a.name.localeCompare(b.name) : B - A;
}

const isFolder = (entry) => Boolean(entry.entries);

function NoProjects() {
	return (
		<Card className="file-browser-scroll-container">
			<CardBody>
				<div className="p-4">
					You have no Harper applications yet. <br />
					<br />
					Click &quot;
					<i className="fas fa-plus" /> app&quot; above to create one!
					<br />
					<br />
					See the{' '}
					<a
						className="docs-link"
						href="https://docs.harperdb.io/docs/developers/applications"
						target="_blank"
						rel="noreferrer"
					>
						documentation
					</a>{' '}
					for more info on Harper Applications.
				</div>
			</CardBody>
		</Card>
	);
}

function ProjectIcon({ toggleClosed, isOpen }) {
	return (
		<i
			onClick={toggleClosed}
			onKeyDown={toggleClosed}
			className={cn(`project-icon fas fa-file-code`)}
			tabIndex={0}
			aria-expanded={isOpen}
			aria-controls="folder"
			aria-label={isOpen ? 'close project' : 'open project'}
			role="button"
		/>
	);
}

function FolderIcon({ toggleClosed, isOpen }) {
	return (
		<i
			onClick={toggleClosed}
			onKeyDown={toggleClosed}
			className={cn(`folder-icon fas ${isOpen ? 'fa-folder-open' : 'fa-folder'}`)}
			tabIndex={0}
			aria-expanded={isOpen}
			aria-controls="folder"
			aria-label={isOpen ? 'close folder' : 'open folder'}
			role="button"
		/>
	);
}

function FiletypeIcon(extension) {
	let extensionCn = 'unknown far fa-file-alt';
	if (extension === 'js') extensionCn = 'js fab fa-js';
	if (extension === 'yaml') extensionCn = 'yaml fas fa-cog';
	return <i className={cn(`file-icon filetype-${extensionCn}`)} />;
}

function Package({ name, url, onPackageSelect, selectedPackage }) {
	// FIXME: when we click another package, they both get selected.
	const [selected, setSelected] = useState(Boolean(selectedPackage) && name === selectedPackage?.name);

	useEffect(() => {
		setSelected(selectedPackage && selectedPackage.name === name);
	}, [selectedPackage, name]);

	return (
		<button
			type="button"
			onClick={(e) => {
				if (selected) {
					onPackageSelect(null);
				} else {
					onPackageSelect({ name, url, event: e });
				}
				setSelected(!selected);
			}}
			className={cn('package', {
				'package-selected': selected,
			})}
		>
			<i className={cn('package-icon fas fa-cube')} />
			<span className="package-text">{name}</span>
		</button>
	);
}

// Entry could be a harper component (top level), directory, or file
function Entry({ directoryEntry, selectedFile, selectedFolder, onFileSelect, onFolderSelect, Icon }) {
	const isFileSelected = directoryEntry.path === selectedFile;
	const isFolderSelected = directoryEntry.path === selectedFolder?.path;
	// file receives open/close toggle func from
	// parent. if it's a dir, calls toggle func on click
	// if it's a flat file, calls onFileSelect so
	// parent can get file content.

	function handleEntryClicked() {
		const isDir = isFolder(directoryEntry);

		if (isDir) {
			// console.log('isDir & directoryEntry: ', directoryEntry);
			// console.log("isFolderSelected?? ", isFolderSelected);
			// directory clicked: set to selected / highlighted & toggle visibliity
			onFolderSelect(isFolderSelected ? null : directoryEntry);

			// one click on dir name toggles selected / highlighted state / ui
			// if (isFolderSelected && iconWasClicked) {
			// 	// TODO: don't
			// } else {
			// onFolderSelect(isFolderSelected ? null : directoryEntry);
			// }
			// } else if (isFileSelected) {
			// 	// TODO: why are we doing this...?
			// 	onFileSelect(null);
			// } else {
		} else {
			// file clicked: set to selected / highlighted & retrieve file content
			onFileSelect(directoryEntry);
		}
	}

	return (
		<button
			type="button"
			onClick={handleEntryClicked}
			className={cn('file', {
				'file-selected': isFileSelected,
				'folder-selected': isFolderSelected,
			})}
		>
			<Icon className="filename-icon" />
			<span className="filename-text">{directoryEntry.name}</span>
		</button>
	);
}

function Entries({
	directoryEntry, // this is actually the fileTree for current entry
	onFolderSelect,
	onDeployProject,
	onFileSelect,
	onPackageSelect,
	onFileRename,
	selectedFile,
	selectedFolder,
	selectedPackage,
}) {
	const [open, setOpen] = useState(true);

	const entries = [...(directoryEntry.entries || [])].sort(directorySortComparator);
	const fileExtension = parseFileExtension(directoryEntry.name);

	let Icon;
	// top-level dir === package
	if (directoryEntry.path.split('/').length === 2) {
		Icon = () => ProjectIcon({ isOpen: open, toggleClosed: () => setOpen(!open) });
	} else if (directoryEntry.entries) {
		Icon = () => FolderIcon({ isOpen: open, toggleClosed: () => setOpen(!open) });
	} else {
		Icon = () => FiletypeIcon(fileExtension);
	}

	return (
		<>
			{
				// Note: 'components' in this context refers to all user projects AKA Harper Components
				// TODO: do not pass top level of ALL projects to FileBrowser.js, adds unnecessary compute?
				directoryEntry.name !== 'components' ? (
					<li
						key={directoryEntry.key}
						className={cn(
							`${directoryEntry.entries ? 'folder-container' : 'file-container'} ${open ? 'folder-open' : 'folder-closed'}`
						)}
					>
						{directoryEntry.package ? (
							<Package
								selectedPackage={selectedPackage}
								onPackageSelect={onPackageSelect}
								name={directoryEntry.name}
								url={directoryEntry.package}
							/>
						) : (
							<Entry
								Icon={Icon}
								selectedFile={selectedFile}
								selectedFolder={selectedFolder}
								selectedPackage={selectedPackage}
								directoryEntry={directoryEntry}
								onDeployProject={onDeployProject}
								onFileRename={() => {
									onFileRename(directoryEntry);
								}}
								onFileSelect={onFileSelect}
								onFolderSelect={onFolderSelect}
							/>
						)}
					</li>
				) : null
			}

			{entries.map((entry) => (
				<li key={entry.key}>
					<ul
						className={cn('folder', {
							// TODO: fix this logic, folders aren't closing.
							'folder-contents-open': true,
							'folder-contents-closed': false,
						})}
					>
						<Entries
							selectedFile={selectedFile}
							selectedFolder={selectedFolder}
							selectedPackage={selectedPackage}
							directoryEntry={entry}
							onFileSelect={onFileSelect}
							onDeployProject={onDeployProject}
							onFileRename={onFileRename}
							onFolderSelect={onFolderSelect}
							onPackageSelect={onPackageSelect}
						/>
					</ul>
				</li>
			))}
		</>
	);
}

const setDefaultEntriesVisibility = (entries) => 
	// eslint-disable-next-line
	 entries.map((entry) => {
		if (isFolder(entry)) {
			if (Array.isArray(entry.entries)) {
				// Recursively call the function for nested entries
				return {
					...entry,
					visible: true,
					entries: setDefaultEntriesVisibility(entry.entries), // Recursively modify entries
				};
			} 
				return entry; // Return the entry as is if it doesn't have entries
			
		}
	})
;

// A recursive directory tree representation
function FileBrowser({
	fileTree,
	onFileSelect,
	onFolderSelect,
	onPackageSelect,
	onDeployProject,
	onFileRename,
	selectedFile,
	selectedFolder,
	selectedPackage,
}) {
	// This functionality controls file tree visibility based on which directories are toggled open or closed
	const [files, setFiles] = useState(setDefaultEntriesVisibility(fileTree.entries));

	console.log('files!!!! ', files);

	return !fileTree?.entries?.length ? (
		<NoProjects />
	) : (
		<Card className="file-browser-scroll-container">
			<CardBody>
				<ul className="file-browser">
					<Entries
						selectedFile={selectedFile}
						selectedFolder={selectedFolder}
						selectedPackage={selectedPackage}
						onFileSelect={onFileSelect}
						onFileRename={onFileRename}
						onFolderSelect={onFolderSelect}
						onDeployProject={onDeployProject}
						onPackageSelect={onPackageSelect}
						directoryEntry={fileTree}
					/>
				</ul>
			</CardBody>
		</Card>
	);
}

export default FileBrowser;

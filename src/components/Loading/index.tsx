const Loading = () => {
	return (
		<div className={`fixed translate-1/2 h-full w-full z-50 text-white`}>
			<img src="/HDBDogOnly.svg" width="100px" height="100px" alt="HDB Dog Logo Loading" />
			<p>Loading...</p>
		</div>
	);
};

export default Loading;

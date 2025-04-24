interface LoadingProps extends React.ComponentProps<'div'> {
	text?: string;
}

const Loading = ({ className, text, ...props }: LoadingProps) => {
	return (
		<div className={`text-white h-full w-full ${className}`} {...props}>
			<img src="/HDBDogOnly.svg" width="100px" height="100px" alt="HDB Dog Logo Loading" />
			<p className="pt-4">{!text ? 'Loading...' : text}</p>
		</div>
	);
};

export default Loading;

import { createBrowserRouter } from 'react-router';
import LocalSignIn from '@/features/auth/LocalSignIn';

const localRouter = createBrowserRouter([
	{
		path: '/',
		Component: LocalSignIn,
		// children: [
		//   {
		//     path: "shows/:showId",
		//     Component: Show,
		//     loader: ({ request, params }) =>
		//       fetch(`/api/show/${params.id}.json`, {
		//         signal: request.signal,
		//       }),
		//   },
		// ],
	},
]);

export default localRouter;

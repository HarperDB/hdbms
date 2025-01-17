import AuthLayout from "@/components/layouts/AuthLayout.tsx";
import FabricApp from "@/FabricApp";


const authRoutes = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'sign-in',
        element: <FabricApp />,
        index: true,
      },
      // {
      //   path: 'sign-up',
      //   element: <SignUp />,
      // },
    ],
  },
];

export default authRoutes;

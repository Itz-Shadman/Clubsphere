// src/Routes/Routes.jsx
import { createBrowserRouter, Navigate } from "react-router"; 
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout"; 
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Clubs from "../pages/Clubs/Clubs";
import ClubDetails from "../pages/Clubs/ClubDetails";
import Events from "../pages/Events/Events";
import ManagerOverview from "../pages/Dashboard/Manager/ManagerOverview";
import MyClubs from "../pages/Dashboard/Manager/MyClubs";
import MemberOverview from "../pages/Dashboard/Member/MemberOverview";
import MyMemberships from "../pages/Dashboard/Member/MyMemberships";
import PrivateRoute from "./PrivateRoute";
import ManageClubs from "../pages/Dashboard/Admin/ManageClubs";
import ManageEvents from "../pages/Dashboard/Manager/ManageEvents";
import EventDetails from "../pages/EventDetails";
import AdminOverview from "../pages/Dashboard/Admin/AdminOverview";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManagePayments from "../pages/Dashboard/Admin/ManagePayments";
import ClubMembers from "../pages/Dashboard/Manager/ClubMembers";
import EventRegistrations from "../pages/Dashboard/Manager/EventRegistrations";
import AddEvent from "../pages/Dashboard/Manager/AddEvent";
import AddClub from "../pages/Dashboard/Manager/AddClub";
import Payment from "../pages/Payment/Payment";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/clubs", element: <Clubs /> },
            { path: "/clubs/:id", element: <ClubDetails /> },
            { path: "/events", element: <Events /> },
            { path: "/events/:id", element: <EventDetails /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        errorElement: <ErrorPage />,
        children: [
            // Admin Routes
            { path: "admin-overview", element: <AdminOverview /> }, // Ensure this exists
            { path: "admin", element: <Navigate to="/dashboard/admin-overview" replace /> },
            { path: "admin-users", element: <ManageUsers /> },
            { path: "admin-clubs", element: <ManageClubs /> },
            { path: "manage-payments", element: <ManagePayments /> },
            
            // Manager Routes
            { path: "manager-overview", element: <ManagerOverview /> },
            { path: "manager-my-clubs", element: <MyClubs /> },
            { path: "add-club", element: <AddClub /> },
            { path: "manager-events", element: <ManageEvents /> },
            { path: "add-event", element: <AddEvent /> },
            { path: "club-members", element: <ClubMembers /> },
            { path: "event-registrations/:id", element: <EventRegistrations /> },
            
            // Member & Payment Routes
            { path: "member-overview", element: <MemberOverview /> },
            { path: "member-my-clubs", element: <MyMemberships /> },
            { path: "payment", element: <Payment /> },
            { 
                path: "member", 
                element: <Navigate to="/dashboard/member-overview" replace /> 
            },
        ]
    }
]);

export default router;
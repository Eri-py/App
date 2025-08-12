import { useNavigate } from "@tanstack/react-router";

export function useNavigationButtons() {
  const navigate = useNavigate();

  // Create button.
  const handleCreateClick = () => {
    navigate({ to: "/create" });
  };

  //messages button. Would probably move to its own separate hook to handle notifications.
  const handleMessagesClick = () => {
    navigate({ to: "/messages" });
  };

  //profile button. Would probably move to its own separate hook to handle notifications.
  const handleProfileClick = () => {
    navigate({ to: "/profile" });
  };

  return { handleCreateClick, handleMessagesClick, handleProfileClick };
}

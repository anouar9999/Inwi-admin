import React from "react";

export const SquadFormatCard = ({ icon, title, subTitle }) => (
    <div className="bg-gray-800 p-4 angular-cut flex flex-col items-center text-center">
      {typeof icon === 'string' ? (
        <img src={icon} alt={title} className="w-14 h-12 mb-2" />
      ) : (
        React.cloneElement(icon, { size: 24, className: 'mb-2' })
      )}
      <h4 className="font-bold">{title}</h4>
      <p className="text-xs text-gray-400">{subTitle}</p>
    </div>
  );

  // const handleEdit = () => {
  //   router.push(`/dashboards/edit-tournament/${tournamentId}`);
  // };

  // const handleDelete = async () => {
  //   if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
  //     setLoading(true);
  //     try {
  //       const response = await axios.post(
  //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_tournament.php`,
  //         { tournament_id: tournamentId }
  //       );

  //       if (response.data.success) {
  //         showToast(response.data.message, "success", 1500);
  //         setTimeout(() => {
  //           router.push('/dashboards/tournaments');
  //         }, 1500);
  //       } else {
  //         showToast(response.data.message, "error", 5000);
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //       alert(`An error occurred while deleting the tournament.${error}`);
  //     }finally {
  //       setLoading(false);
  //     }
  //   }
  // };

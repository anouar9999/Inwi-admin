'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Eye } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const TournamentEdit = () => {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    id: id,
    nom_des_qualifications: '',
    start_date: '',
    end_date: '',
    status: '',
    description_des_qualifications: '',
    nombre_maximum_participants: '',
    prize_pool: '',
    format_des_qualifications: '',
    type_de_match: '',
    type_de_jeu: '',
    image: '',
  });

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_tournament.php?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tournament data');
        }
        const data = await response.json();
        if (data.success) {
          // Format dates for input fields
          const formattedData = {
            ...data.data,
            start_date: formatDate(data.data.start_date),
            end_date: formatDate(data.data.end_date),
          };
          setFormData(formattedData);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error fetching tournament data:', error);
        alert('Failed to load tournament data. Please try again.');
      }
    };

    fetchTournamentData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edit_tournament.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data)
      if (data.success) {
        toast.success(data.message,{autoClose:1500})
        setTimeout(() => {
         router.push('/dashboards/tournaments'); // Redirect to tournaments list
        }, 1500);
      } else {
        alert('Error updating tournament: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the tournament.');
    }
  };

  return (
    <div className="text-gray-300 min-h-screen p-4">
      <ToastContainer />
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-2">MODIFIER LE TOURNOI</h1>
        <p className="text-gray-500 mb-8">Modifiez les détails du tournoi.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom des Qualifications</label>
              <input
                type="text"
                name="nom_des_qualifications"
                value={formData.nom_des_qualifications}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de Début</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Date de Fin</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Statut des Qualifications</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              >
                <option>Ouvert aux inscriptions</option>
                <option>En cours</option>
                <option>Terminé</option>
                <option>Annulé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description des Qualifications</label>
            <textarea
              name="description_des_qualifications"
              value={formData.description_des_qualifications}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 angular-cut"
              rows="4"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre Maximum de Participants
              </label>
              <input
                type="number"
                name="nombre_maximum_participants"
                value={formData.nombre_maximum_participants}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Format des Qualifications</label>
              <select
                name="format_des_qualifications"
                value={formData.format_des_qualifications}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              >
                <option>Single Elimination</option>
                {/* Add other format options if needed */}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Type de Match</label>
              <input
                type="text"
                name="type_de_match"
                value={formData.type_de_match}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type de Jeu</label>
              <input
                type="text"
                name="type_de_jeu"
                value={formData.type_de_jeu}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Prize Pool</label>
              <input
                type="number"
                name="prize_pool"
                value={formData.prize_pool}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 angular-cut"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-600 text-white angular-cut-button"
            >
              ANNULER
            </button>
            <button type="submit" className="px-6 py-3 bg-orange-500 text-white angular-cut-button">
              METTRE À JOUR LE TOURNOI
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .angular-cut {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .angular-cut::before,
        .angular-cut::after {
          content: '';
          position: absolute;
          background-color: #374151;
        }
        .angular-cut::before {
          top: 0;
          right: 0;
          width: 0px;
          height: 0px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut::after {
          bottom: 0;
          left: 0;
          width: 0px;
          height: 0px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
        .angular-cut-button {
          position: relative;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .angular-cut-button::before,
        .angular-cut-button::after {
          content: '';
          position: absolute;
          background-color: #78350f;
        }
        .angular-cut-button::before {
          top: 0;
          right: 0;
          width: 0px;
          height: 10px;
          transform: skew(-45deg);
          transform-origin: top right;
        }
        .angular-cut-button::after {
          bottom: 0;
          left: 0;
          width: 0px;
          height: 2px;
          transform: skew(-45deg);
          transform-origin: bottom left;
        }
      `}</style>
    </div>
  );
};

export default TournamentEdit;

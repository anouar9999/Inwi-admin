'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check, User, Users } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrizePoolInput from '../../new-tournament/numberInput';
import ParticipantInput from '../../new-tournament/participantInput';
import TeamSizeInput from '../../new-tournament/TeamInput'
import { useToast } from '@/utils/ToastProvider';
import TransparentLoader from '../../tournament/[slug]/Loader';
import LoadingOverlay from '../../tournament/[slug]/Loading';
import CompetitionTypeSelector from './CompetitionType';
import { competitionTypes } from '@/utils/helpers';
const ParticipationTypeToggle = ({ value, onChange, disabled }) => {
  const types = [
    { id: 'participant', icon: User, label: 'Participant Individuel' },
    { id: 'team', icon: Users, label: 'Équipe' },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">Type de Participation</label>
      <div className="grid grid-cols-2 gap-4">
        {types.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onChange({ target: { name: 'participation_type', value: id } })}
            className={`
              relative flex items-center angular-cut p-3 rounded-lg bg-gray-800 transition-all duration-200
              ${value === id ? ' bg-primary/10 text-primary' : '  text-gray-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-center space-x-2">
              <Icon className={`w-5 h-5 ${value === id ? 'text-primary' : 'text-gray-400'}`} />
              <span className="font-medium">{label}</span>
            </div>

            {value === id && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-primary" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const TournamentEdit = () => {
  const router = useRouter();
  const { id } = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: id,
    nom_des_qualifications: '',
    competition_type: '',
    participation_type: 'participant',
    nombre_maximum: '',
    start_date: '',
    end_date: '',
    status: '',
    description_des_qualifications: '',
    rules: '',
    prize_pool: '',
    format_des_qualifications: '',
    type_de_match: '',
    type_de_jeu: '',
    image: '',
  });



  const statusOptions = ['Ouvert aux inscriptions', 'En cours', 'Terminé', 'Annulé'];

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_tournament.php?id=${id}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch tournament data');
        }
        const data = await response.json();
        if (data.success) {
          console.log(data)
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
        showToast('Failed to load tournament data. Please try again.', "error", 1500);
       
      }
    };

    fetchTournamentData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast("L'image ne doit pas dépasser 5MB", "error", 5000);
        
          return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          showToast("Format d'image non supporté. Utilisez JPG, PNG ou GIF", "error", 5000);
          return;
        }

        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);

        // Log the data being sent
        console.log('Sending data:', formData);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edit_tournament.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add this if you're getting CORS errors
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                // Ensure dates are in the correct format
                start_date: formData.start_date ? new Date(formData.start_date).toISOString().split('T')[0] : null,
                end_date: formData.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : null,
            }),
        });

        const data = await response.json();
        console.log('Response:', data);

        if (data.success) {
            showToast(data.message, "success", 3000);
            setTimeout(() => {
                router.push('/dashboards/tournaments');
            }, 1500);
        } else {
            showToast(data.message || 'Error updating tournament', "error", 3000);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred while updating the tournament', "error", 3000);
    } finally {
        setLoading(false);
    }
};
  if (loading)
    return (
      <LoadingOverlay text="Submiting Changes..." />
    );
  return (
    <div className="text-gray-300 min-h-screen p-4">
      <div className="mx-auto">
        <h1 className="text-5xl font-custom mb-2">MODIFIER LE TOURNOI</h1>
        <p className="text-gray-500 mb-8">Modifiez les détails du tournoi.</p>

        <div className="space-y-8">
          {/* Competition Type Selection */}
          <CompetitionTypeSelector competitionTypes={competitionTypes} selectedType={formData.competition_type}  />
        

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom des Qualifications <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom_des_qualifications"
                  value={formData.nom_des_qualifications}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  required
                />
              </div>

              <ParticipationTypeToggle
                value={formData.participation_type}
                onChange={handleChange}
                disabled={false} // Disabled in edit mode
              />
            </div>

            {/* Dates and Status */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Date de Début</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date de Fin</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Participants and Prize Pool */}
            <div className="grid grid-cols-3 gap-6">
              {formData.participation_type === 'team' ? (
       
                <TeamSizeInput value={formData.nombre_maximum} onChange={handleChange} />
              ) : (
                <ParticipantInput value={formData.nombre_maximum} onChange={handleChange} />
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Format des Qualifications</label>
                <select
                  name="format_des_qualifications"
                  value={formData.format_des_qualifications}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                >
                  <option>Single Elimination</option>
                  <option>Double Elimination</option>
                  <option>Round Robin</option>
                </select>
              </div>

              <PrizePoolInput value={formData.prize_pool} onChange={handleChange} />
            </div>

            {/* Description and Rules */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description des Qualifications
                </label>
                <textarea
                  name="description_des_qualifications"
                  value={formData.description_des_qualifications}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Règles du Tournoi</label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  rows="4"
                />
              </div>
            </div>

            {/* Match Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Type de Match</label>
                <input
                  type="text"
                  name="type_de_match"
                  value={formData.type_de_match}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type de Jeu</label>
                <input
                  type="text"
                  name="type_de_jeu"
                  value={formData.type_de_jeu}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-600 text-white angular-cut"
              >
                ANNULER
              </button>
              <button type="submit" className="px-6 py-3 bg-primary text-white angular-cut">
                METTRE À JOUR
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TournamentEdit;

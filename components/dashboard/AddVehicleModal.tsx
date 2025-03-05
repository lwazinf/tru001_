'use client';

import React, { useState } from 'react';
import { Car, X, Calendar, FileText, CheckCircle, ChevronLeft, ChevronRight, Search, Droplets, Trash2 } from 'lucide-react';

interface AddVehicleModalProps {
  newVehicle: {
    name: string;
    type: string;
  };
  handleVehicleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onAdd: () => void;
  onVehicleSelect?: (vehicleData: any) => void;
}

// Type for the fuel tank capacity data structure
interface FuelTankCapacity {
  value: string;
  unit: string;
}

// Added Vehicle interface
interface Vehicle {
  id: string;
  name: string;
  year?: string;
  numberPlate?: string;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  handleVehicleChange,
  onClose,
  onAdd,
  onVehicleSelect
}) => {
  type ModalState = 'FORM' | 'LOADING' | 'RESULTS' | 'CAPACITY_INPUT';
  
  const [modalState, setModalState] = useState<ModalState>('FORM');
  const [vehicleData, setVehicleData] = useState({
    make: '',
    year: '',
    numberPlate: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 3;
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Add state for manual fuel capacity input
  const [manualCapacity, setManualCapacity] = useState('');
  const [capacityUnit, setCapacityUnit] = useState('l');

  // Update form values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert number plate to uppercase
    if (name === 'numberPlate') {
      setVehicleData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    } else {
      setVehicleData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate form fields
  const validateFields = () => {
    if (!vehicleData.make.trim()) {
      setError('Make is required');
      return false;
    }
    
    if (!vehicleData.numberPlate.trim()) {
      setError('Number plate is required');
      return false;
    }
    
    const year = parseInt(vehicleData.year.trim());
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      setError('Valid year is required');
      return false;
    }
    
    return true;
  };

  // Fetch vehicle data using our internal API route
  const fetchVehicleData = async () => {
    const params = new URLSearchParams();
    
    if (vehicleData.make.trim()) {
      params.append('makeName', vehicleData.make.trim());
    }
    
    const year = parseInt(vehicleData.year.trim());
    if (!isNaN(year)) {
      params.append('year', year.toString());
    }
    
    // Use our internal API route instead of the external one
    const url = `/api/car-details?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to load vehicle data');
      }
      const data = await response.json();
      console.log('API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      throw error;
    }
  };

  // Helper to format fuel tank capacity
  const formatFuelTankCapacity = (fuelTankCapacity: FuelTankCapacity[] | undefined): string => {
    if (!fuelTankCapacity || fuelTankCapacity.length === 0) {
      return 'N/A';
    }
    
    const capacity = fuelTankCapacity[0];
    return `${capacity.value} ${capacity.unit}`;
  };

  // Handle state transitions with smooth animation
  const changeModalState = (newState: ModalState) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setModalState(newState);
      setIsTransitioning(false);
    }, 300);
  };

  // Handle search for vehicles
  const handleSearchVehicles = async () => {
    setError(null);
    
    if (!validateFields()) {
      return;
    }
    
    changeModalState('LOADING');
    
    try {
      // Fetch vehicle data from API
      const result = await fetchVehicleData();
      
      if (Array.isArray(result) && result.length > 0) {
        setApiResults(result);
        setSelectedVehicleIndex(null);
        setCurrentPage(0);
        changeModalState('RESULTS');
      } else {
        setError('No vehicles found. Please try different search criteria.');
        changeModalState('FORM');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      changeModalState('FORM');
    }
  };

  // Handle vehicle selection with animation
  const handleSelectVehicle = (index: number) => {
    setSelectedVehicleIndex(index);
  };

  // Remove selected vehicle
  const handleRemoveVehicle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    setSelectedVehicleIndex(null);
  };

  // Handle final vehicle confirmation
  const handleConfirmVehicle = () => {
    if (selectedVehicleIndex !== null && apiResults.length > 0) {
      const selectedVehicle = apiResults[selectedVehicleIndex];
      
      // Check if the vehicle has fuel tank capacity data
      if (!selectedVehicle.fuel_tank_capacity || selectedVehicle.fuel_tank_capacity.length === 0) {
        // If not, transition to the capacity input state
        changeModalState('CAPACITY_INPUT');
        return;
      }
      
      // Pass the complete vehicle data to parent component
      if (onVehicleSelect) {
        onVehicleSelect(selectedVehicle);
      }
      
      // Format the vehicle name using the selected data
      const vehicleName = `${selectedVehicle.make_name} ${selectedVehicle.model_name} (${selectedVehicle.year_from})`;
      
      // Update the original vehicle object
      handleVehicleChange({
        target: {
          name: 'name',
          value: vehicleName
        }
      } as React.ChangeEvent<HTMLInputElement>);
      
      handleVehicleChange({
        target: {
          name: 'type',
          value: vehicleData.numberPlate
        }
      } as React.ChangeEvent<HTMLInputElement>);
      
      // Close modal and add vehicle
      onAdd();
    } else {
      setError('Please select a vehicle');
    }
  };

  // Add a new function to handle manual capacity confirmation
  const handleConfirmManualCapacity = () => {
    if (!manualCapacity || isNaN(Number(manualCapacity)) || Number(manualCapacity) <= 0) {
      setError('Please enter a valid fuel tank capacity');
      return;
    }

    if (selectedVehicleIndex !== null && apiResults.length > 0) {
      const selectedVehicle = apiResults[selectedVehicleIndex];
      
      // Add the manually entered fuel capacity to the vehicle data
      const enhancedVehicle = {
        ...selectedVehicle,
        fuel_tank_capacity: [
          {
            value: manualCapacity,
            unit: capacityUnit
          }
        ]
      };
      
      // Pass the enhanced vehicle data to parent component
      if (onVehicleSelect) {
        onVehicleSelect(enhancedVehicle);
      }
      
      // Format the vehicle name using the selected data
      const vehicleName = `${selectedVehicle.make_name} ${selectedVehicle.model_name} (${selectedVehicle.year_from})`;
      
      // Update the original vehicle object
      handleVehicleChange({
        target: {
          name: 'name',
          value: vehicleName
        }
      } as React.ChangeEvent<HTMLInputElement>);
      
      handleVehicleChange({
        target: {
          name: 'type',
          value: vehicleData.numberPlate
        }
      } as React.ChangeEvent<HTMLInputElement>);
      
      // Close modal and add vehicle
      onAdd();
    } else {
      setError('No vehicle selected');
      changeModalState('RESULTS');
    }
  };

  // Add a function to go back to results from capacity input
  const handleBackToResults = () => {
    changeModalState('RESULTS');
  };

  // Handle back to form
  const handleBackToForm = () => {
    changeModalState('FORM');
    setSelectedVehicleIndex(null);
  };

  // Handle page navigation with animation
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(apiResults.length / resultsPerPage);
  const paginatedResults = apiResults.slice(
    currentPage * resultsPerPage, 
    (currentPage + 1) * resultsPerPage
  );

  // Render form content
  const renderFormContent = () => (
    <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {error && (
        <div className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 animate-in fade-in slide-in-from-top-4 duration-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5 transition-all duration-200 hover:translate-y-[-1px]">
          <label className="text-xs text-gray-300 flex items-center gap-1">
            <Car className="h-3 w-3 text-gray-400" />
            Make
          </label>
          <input
            type="text"
            name="make"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 focus:shadow-[0_0_8px_rgba(251,191,36,0.1)] hover:bg-gray-800/70"
            placeholder="e.g., Toyota, BMW, Ford"
            value={vehicleData.make}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-1.5 transition-all duration-200 hover:translate-y-[-1px]">
          <label className="text-xs text-gray-300 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            Year
          </label>
          <input
            type="number"
            name="year"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 focus:shadow-[0_0_8px_rgba(251,191,36,0.1)] hover:bg-gray-800/70"
            placeholder="e.g., 2020"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={vehicleData.year}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-1.5 transition-all duration-200 hover:translate-y-[-1px]">
          <label className="text-xs text-gray-300 flex items-center gap-1">
            <FileText className="h-3 w-3 text-gray-400" />
            Number Plate
          </label>
          <input
            type="text"
            name="numberPlate"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 focus:shadow-[0_0_8px_rgba(251,191,36,0.1)] hover:bg-gray-800/70 uppercase"
            placeholder="e.g., ABC123GP"
            value={vehicleData.numberPlate}
            onChange={handleChange}
            maxLength={12}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <div
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-md text-xs font-medium text-gray-300 transition-all duration-200 cursor-pointer hover:shadow-md hover:shadow-black/10 hover:translate-y-[-1px] active:translate-y-[0px]"
            role="button"
            tabIndex={0}
          >
            Cancel
          </div>
          <div
            onClick={handleSearchVehicles}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 cursor-pointer text-gray-900 rounded-md text-xs font-bold transition-all duration-200 shadow-lg shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/20 hover:translate-y-[-1px] active:translate-y-[0px] flex items-center gap-2"
            role="button"
            tabIndex={0}
          >
            <Search className="h-3 w-3" />
            <span>Search Vehicles</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render loading content
  const renderLoadingContent = () => (
    <div className="flex flex-col items-center justify-center py-12 transition-all duration-300">
      <div className="h-12 w-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-4 relative">
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/20"></div>
        <div className="absolute h-2 w-2 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 rounded-full"></div>
      </div>
      <p className="text-sm text-gray-300 animate-pulse">Searching for matching vehicles...</p>
    </div>
  );

  // Render results content
  const renderResultsContent = () => (
    <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="mb-4 flex items-center justify-between">
        <div 
          onClick={handleBackToForm}
          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors hover:bg-gray-800/50 px-2 py-1 rounded-md cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <ChevronLeft className="h-3 w-3" />
          <span>Back to Search</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md">
          {apiResults.length} vehicles found
        </span>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 animate-in fade-in slide-in-from-top-4 duration-300">
          {error}
        </div>
      )}

      <div className="mb-4 space-y-2 relative">
        {/* Visual indicator of page transition */}
        <div className={`absolute inset-0 bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center ${isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
          <div className="h-8 w-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></div>
        </div>
        
        {paginatedResults.map((vehicle, index) => {
          const actualIndex = currentPage * resultsPerPage + index;
          const isSelected = selectedVehicleIndex === actualIndex;
          
          return (
            <div 
              key={`${vehicle.make_name}-${vehicle.model_name}-${index}`}
              onClick={() => handleSelectVehicle(actualIndex)}
              className={`p-3 rounded-md cursor-pointer transition-all duration-200 border ${
                isSelected 
                  ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_10px_rgba(251,191,36,0.1)]' 
                  : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600 hover:translate-y-[-1px]'
              }`}
              style={{
                transitionDelay: `${index * 50}ms`
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${isSelected ? 'text-amber-400' : 'text-gray-200'} transition-colors duration-200`}>
                    {vehicle.make_name} {vehicle.model_name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {/* Display year in a smaller badge */}
                    <span className="text-xs text-gray-500 bg-gray-800/70 px-1.5 py-0.5 rounded">
                      {vehicle.year_from}{vehicle.year_to && vehicle.year_to !== vehicle.year_from ? ` - ${vehicle.year_to}` : ''}
                    </span>
                    
                    {/* Display fuel tank capacity with icon */}
                    <span className="text-xs text-gray-300 flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-blue-400" />
                      {vehicle.fuel_tank_capacity ? 
                        formatFuelTankCapacity(vehicle.fuel_tank_capacity) :
                        'Tank capacity: N/A'
                      }
                    </span>
                    
                    {vehicle.engine_capacity && (
                      <span className="text-xs text-gray-400">
                        • {vehicle.engine_capacity}L
                      </span>
                    )}
                    {vehicle.body_type && (
                      <span className="text-xs text-gray-400">
                        • {vehicle.body_type}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected ? (
                  <div className="flex items-center gap-2">
                    <div 
                      onClick={(e) => handleRemoveVehicle(e)} 
                      className="h-6 w-6 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors duration-200"
                      title="Remove selection"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </div>
                    <CheckCircle className="h-5 w-5 text-amber-400 animate-in fade-in zoom-in-50 duration-200" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border border-gray-700"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Pagination with divs instead of buttons */}
      {totalPages > 1 && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div
              onClick={currentPage > 0 ? goToPreviousPage : undefined}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-all duration-200 ${
                currentPage === 0
                  ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800/50 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:shadow-md hover:translate-y-[-1px] active:translate-y-[0px] cursor-pointer'
              }`}
              role="button"
              tabIndex={currentPage > 0 ? 0 : -1}
              aria-disabled={currentPage === 0}
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="text-xs">Previous</span>
            </div>
            
            <span className="text-xs text-gray-400 bg-gray-800/30 px-2 py-1 rounded-md">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <div
              onClick={currentPage < totalPages - 1 ? goToNextPage : undefined}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-all duration-200 ${
                currentPage === totalPages - 1
                  ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800/50 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:shadow-md hover:translate-y-[-1px] active:translate-y-[0px] cursor-pointer'
              }`}
              role="button"
              tabIndex={currentPage < totalPages - 1 ? 0 : -1}
              aria-disabled={currentPage === totalPages - 1}
            >
              <span className="text-xs">Next</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
          
          {/* Page indicator dots */}
          <div className="flex items-center justify-center mt-3 gap-1">
            {[...Array(totalPages)].map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentPage === index 
                    ? 'w-4 bg-amber-500' 
                    : 'w-1.5 bg-gray-700 hover:bg-gray-600 cursor-pointer'
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Number plate display */}
      <div className="mb-4 p-3 border border-gray-700 rounded-md bg-gray-800/30 transition-all duration-200 hover:bg-gray-800/40 hover:border-gray-600">
        <div className="text-xs text-gray-400 mb-1">Selected Number Plate</div>
        <div className="text-sm font-medium text-white">{vehicleData.numberPlate}</div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <div
          onClick={onClose}
          className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-md text-xs font-medium text-gray-300 transition-all duration-200 cursor-pointer hover:shadow-md hover:shadow-black/10 hover:translate-y-[-1px] active:translate-y-[0px]"
          role="button"
          tabIndex={0}
        >
          Cancel
        </div>
        <div
          onClick={selectedVehicleIndex !== null ? handleConfirmVehicle : undefined}
          className={`px-3 py-1.5 transition-all duration-200 rounded-md text-xs font-bold flex items-center gap-2 ${
            selectedVehicleIndex === null
              ? "bg-gray-700 cursor-not-allowed text-gray-500" 
              : "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 cursor-pointer text-gray-900 shadow-lg shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/20 hover:translate-y-[-1px] active:translate-y-[0px]"
          }`}
          role="button"
          tabIndex={selectedVehicleIndex !== null ? 0 : -1}
          aria-disabled={selectedVehicleIndex === null}
        >
          <CheckCircle className="h-3 w-3" />
          <span>Add Selected Vehicle</span>
        </div>
      </div>
    </div>
  );

  // Add a new render function for capacity input
  const renderCapacityInputContent = () => {
    const selectedVehicle = selectedVehicleIndex !== null ? apiResults[selectedVehicleIndex] : null;
    
    return (
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="mb-4 flex items-center justify-between">
          <div 
            onClick={handleBackToResults}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors hover:bg-gray-800/50 px-2 py-1 rounded-md cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <ChevronLeft className="h-3 w-3" />
            <span>Back to Vehicle Selection</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 animate-in fade-in slide-in-from-top-4 duration-300">
            {error}
          </div>
        )}

        {selectedVehicle && (
          <div className="mb-4 p-3 border border-amber-500/20 rounded-md bg-amber-500/5 transition-all duration-200">
            <h4 className="text-sm font-medium text-amber-400 mb-2">
              {selectedVehicle.make_name} {selectedVehicle.model_name}
            </h4>
            <p className="text-xs text-gray-300 mb-3">
              This vehicle is missing fuel tank capacity information. Please provide it below:
            </p>
            
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">
                  Fuel Tank Capacity
                </label>
                <input
                  type="number"
                  value={manualCapacity}
                  onChange={(e) => setManualCapacity(e.target.value)}
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                  placeholder="e.g., 65"
                  min="1"
                  step="0.1"
                />
              </div>
              
              <div className="w-24">
                <label className="text-xs text-gray-400 mb-1 block">
                  Unit
                </label>
                <select
                  value={capacityUnit}
                  onChange={(e) => setCapacityUnit(e.target.value)}
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                >
                  <option value="l">Liters (l)</option>
                  <option value="gal">Gallons (gal)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-3 flex items-center text-xs text-blue-400">
              <Droplets className="h-3 w-3 mr-1" />
              <span>This helps us calculate your fuel requirements accurately</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <div
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-md text-xs font-medium text-gray-300 transition-all duration-200 cursor-pointer hover:shadow-md hover:shadow-black/10 hover:translate-y-[-1px] active:translate-y-[0px]"
            role="button"
            tabIndex={0}
          >
            Cancel
          </div>
          <div
            onClick={handleConfirmManualCapacity}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 cursor-pointer text-gray-900 rounded-md text-xs font-bold transition-all duration-200 shadow-lg shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/20 hover:translate-y-[-1px] active:translate-y-[0px] flex items-center gap-2"
            role="button"
            tabIndex={0}
          >
            <CheckCircle className="h-3 w-3" />
            <span>Confirm & Add Vehicle</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm transition-all duration-500 animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 w-full max-w-md mx-4 shadow-2xl shadow-black/40 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
        <div
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        >
          <X className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 transition-all duration-200">
            <div className="p-1 rounded-full bg-amber-600/10">
              <Car className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-200">
              {modalState === 'FORM' ? 'Add New Vehicle' : 
               modalState === 'RESULTS' ? 'Select a Vehicle' : 
               modalState === 'CAPACITY_INPUT' ? 'Fuel Tank Capacity' :
               'Searching...'}
            </h3>
          </div>
          <p className="text-xs text-gray-400 transition-all duration-300">
            {modalState === 'FORM' 
              ? 'Add details about your vehicle to help us provide better fuel management services.'
              : modalState === 'RESULTS'
              ? 'Select the vehicle that matches your vehicle details.'
              : modalState === 'CAPACITY_INPUT'
              ? 'Please provide the fuel tank capacity for your selected vehicle.'
              : 'Searching for matching vehicles in our database...'}
          </p>
        </div>

        {modalState === 'FORM' && renderFormContent()}
        {modalState === 'LOADING' && renderLoadingContent()}
        {modalState === 'RESULTS' && renderResultsContent()}
        {modalState === 'CAPACITY_INPUT' && renderCapacityInputContent()}
      </div>
    </div>
  );
};

// Vehicle Card component with delete button
interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete: (id: string) => void;
  slotNumber?: number;
  isGridView?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  onDelete, 
  slotNumber,
  isGridView = true
}) => {
  // Extract make and model from the name
  const nameParts = vehicle.name.split(' ');
  const make = nameParts[0] || '';
  const model = nameParts.slice(1, -1).join(' ') || '';
  const yearMatch = vehicle.name.match(/\((\d+)\)/);
  const year = yearMatch ? yearMatch[1] : '';
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 relative group transition-all duration-200 hover:bg-gray-800/80">
      {/* Slot number indicator - top left */}
      {isGridView && slotNumber !== undefined && (
        <div className="absolute top-2 left-2 text-xs text-amber-500/80">
          {slotNumber + 1}/{4}
        </div>
      )}
      
      {/* Delete button with text - prominent at top right */}
      <div 
        className="absolute top-2 right-2 transition-all duration-200 flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-md px-2 py-1 text-red-400 hover:text-red-300 cursor-pointer border border-transparent hover:border-red-500/30"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          onDelete(vehicle.id);
        }}
        role="button"
        tabIndex={0}
        aria-label="Delete vehicle and free slot"
        title="Delete vehicle and free slot"
      >
        <Trash2 className="h-3 w-3" />
        <span className="text-xs font-medium">Free slot</span>
      </div>
      
      <div className="flex flex-col space-y-1 pt-6 mt-2"> {/* Added top padding for button space */}
        {/* Vehicle name */}
        <div className="text-sm font-medium text-gray-200 truncate">
          {make} {model}
        </div>
        
        {/* Year */}
        <div className="text-xs text-gray-400">
          {year || 'undefined'}
        </div>
        
        {/* Number plate */}
        {vehicle.numberPlate && (
          <div className="text-xs text-amber-400 font-medium uppercase mt-1">
            {vehicle.numberPlate}
          </div>
        )}
      </div>
    </div>
  );
};

// Empty Vehicle Slot component
interface EmptyVehicleSlotProps {
  slotNumber: number;
  onAddVehicle: () => void;
  maxSlots?: number;
}

export const EmptyVehicleSlot: React.FC<EmptyVehicleSlotProps> = ({ 
  slotNumber, 
  onAddVehicle,
  maxSlots = 4
}) => {
  return (
    <div 
      onClick={onAddVehicle}
      className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 border-dashed relative group transition-all duration-200 hover:bg-gray-800/50 cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
      role="button"
      tabIndex={0}
      aria-label="Add vehicle to this slot"
    >
      {/* Slot number indicator */}
      <div className="absolute top-2 left-2 text-xs text-gray-500">
        {slotNumber + 1}/{maxSlots}
      </div>
      
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center">
          <Car className="h-4 w-4 text-gray-400" />
        </div>
        <span className="text-xs text-gray-400">Add vehicle</span>
      </div>
    </div>
  );
};

// Dashboard Vehicle Card component with delete button
interface DashboardVehicleCardProps {
  id: string;
  name: string;
  licensePlate?: string;
  onDelete?: (id: string) => void;
  onAddClick?: () => void;
  isEmpty?: boolean;
}

export const DashboardVehicleCard: React.FC<DashboardVehicleCardProps> = ({ 
  id, 
  name, 
  licensePlate, 
  onDelete,
  onAddClick,
  isEmpty = false
}) => {
  // If this is an empty slot, render the add button
  if (isEmpty) {
    return (
      <div 
        onClick={onAddClick}
        className="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center min-h-[100px] cursor-pointer hover:bg-gray-800/20 transition-all duration-200"
        role="button"
        tabIndex={0}
        aria-label="Add vehicle"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Car className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-amber-500 font-medium">+ Add Vehicle</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 relative hover:bg-gray-800/50 transition-all duration-200">
      {/* Delete button - top right */}
      {onDelete && (
        <div 
          className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-full text-red-400 hover:text-red-300 cursor-pointer transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          role="button"
          tabIndex={0}
          aria-label="Delete vehicle"
          title="Delete vehicle"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </div>
      )}
      
      {/* Vehicle icon */}
      <div className="flex items-start mb-2">
        <div className="p-1.5 bg-gray-800/80 rounded-full mr-2">
          <Car className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1">
          {/* Vehicle name */}
          <div className="text-sm font-medium text-gray-200 pr-6 mb-1"> {/* Added right padding to avoid text overlap with delete button */}
            {name}
          </div>
          
          {/* License plate */}
          {licensePlate && (
            <div className="text-xs text-amber-500 font-medium uppercase">
              {licensePlate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
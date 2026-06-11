"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, MapPin, TriangleAlert } from "lucide-react";
import {
  searchAddress,
  type AddressResult,
} from "@/service/photon.service";
import { reverseGeocodeAddress } from "@/service/nominatim.service";
import {
  getUserFriendlyErrorMessage,
  logAppError,
} from "@/utils/error-message";

export interface AddressValue {
  address: string;
  lat: number | null;
  lng: number | null;
}

interface AddressAutocompleteProps {
  label: string;
  placeholder: string;
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  required?: boolean;
}

function hasSelectedCoordinates(value: AddressValue) {
  return value.lat !== null && value.lng !== null;
}

export default function AddressAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  required = false,
}: AddressAutocompleteProps) {
  const onChangeRef = useRef(onChange);
  const blurTimeoutRef = useRef<number | null>(null);
  const reverseControllerRef = useRef<AbortController | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResolvingLabel, setIsResolvingLabel] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [helperMessage, setHelperMessage] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const query = value.address.trim();

    if (!query) {
      return;
    }

    if (hasSelectedCoordinates(value)) {
      return;
    }

    const controller = new AbortController();
    const debounceTimeout = window.setTimeout(async () => {
      setIsLoading(true);
      setFetchError("");

      try {
        const results = await searchAddress(query, controller.signal);
        setSuggestions(results);
        setIsDropdownOpen(true);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setSuggestions([]);
        logAppError("Address autocomplete search failed", error);
        setFetchError(getUserFriendlyErrorMessage(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 400);

    return () => {
      controller.abort();
      window.clearTimeout(debounceTimeout);
    };
  }, [value]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current !== null) {
        window.clearTimeout(blurTimeoutRef.current);
      }
      reverseControllerRef.current?.abort();
    };
  }, []);

  const handleSuggestionSelect = async (suggestion: AddressResult) => {
    reverseControllerRef.current?.abort();
    const controller = new AbortController();
    reverseControllerRef.current = controller;

    setFetchError("");
    setHelperMessage("");
    setIsTouched(true);
    setIsDropdownOpen(false);
    setSuggestions([]);
    setIsLoading(false);
    setIsResolvingLabel(true);

    try {
      const reverseResult = await reverseGeocodeAddress(
        suggestion.latitude,
        suggestion.longitude,
        controller.signal,
      );

      onChangeRef.current({
        address: reverseResult.label,
        lat: reverseResult.latitude,
        lng: reverseResult.longitude,
      });
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      logAppError("Address reverse geocode failed", error);
      onChangeRef.current({
        address: suggestion.label,
        lat: suggestion.latitude,
        lng: suggestion.longitude,
      });
      setHelperMessage(
        "Alamat lengkap belum tersedia. Label alamat sementara memakai hasil pencarian.",
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsResolvingLabel(false);
      }
    }
  };

  const showSelectionWarning =
    isTouched && value.address.trim() !== "" && !hasSelectedCoordinates(value);

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-800">{label}</label>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={value.address}
          onChange={(event) => {
            setIsTouched(true);
            setFetchError("");
            setHelperMessage("");
            setIsDropdownOpen(true);
            onChange({
              address: event.target.value,
              lat: null,
              lng: null,
            });
            setSuggestions([]);
            setIsLoading(false);
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
          onBlur={() => {
            setIsTouched(true);
            blurTimeoutRef.current = window.setTimeout(() => {
              setIsDropdownOpen(false);
            }, 150);
          }}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-xl border border-blue-300 px-4 py-3 pl-11 text-sm text-gray-700 placeholder-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        {isDropdownOpen && value.address.trim() !== "" ? (
          <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg">
            {isLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Memuat suggestion alamat...
              </div>
            ) : fetchError ? (
              <div className="px-4 py-3 text-sm text-red-500">
                {fetchError}
              </div>
            ) : suggestions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                Alamat tidak ditemukan di wilayah Indonesia.
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    void handleSuggestionSelect(suggestion);
                  }}
                  className="block w-full border-b border-blue-50 px-4 py-3 text-left text-sm text-gray-700 transition-all last:border-b-0 hover:bg-blue-50"
                >
                  {suggestion.label}
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      {fetchError && !isDropdownOpen ? (
        <p className="flex items-center gap-2 text-xs text-red-500">
          <TriangleAlert className="h-3.5 w-3.5" />
          {fetchError}
        </p>
      ) : null}

      {!fetchError && helperMessage ? (
        <p className="text-xs text-amber-600">{helperMessage}</p>
      ) : null}

      {!fetchError && showSelectionWarning ? (
        <p className="text-xs text-amber-600">
          Pilih alamat dari daftar saran agar koordinat tersimpan.
        </p>
      ) : null}

      {isResolvingLabel ? (
        <p className="flex items-center gap-2 text-xs text-gray-400">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Menyempurnakan label alamat...
        </p>
      ) : null}

      {!fetchError && hasSelectedCoordinates(value) ? (
        <p className="text-xs text-emerald-600">
          Lokasi tersimpan. Lat: {value.lat?.toFixed(6)}, Lng:{" "}
          {value.lng?.toFixed(6)}
        </p>
      ) : null}
    </div>
  );
}

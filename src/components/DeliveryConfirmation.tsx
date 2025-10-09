import { useState, useRef } from "react";
import styled from "styled-components";
import Form from "../UI/Form";
import FormRow from "../UI/FormRow";
import Input from "../UI/Input";
import Textarea from "../UI/Textarea";
import Button from "../UI/Button";
import ButtonGroup from "../UI/ButtonGroup";
import Heading from "../UI/Heading";
import { HiOutlineCamera, HiOutlineTrash } from "react-icons/hi2";

const SignatureCanvas = styled.canvas`
  width: 100%;
  height: 20rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  cursor: crosshair;
  background-color: var(--color-grey-0);
  touch-action: none;
`;

const SignatureContainer = styled.div`
  position: relative;
  margin: 1.6rem 0;
`;

const ClearButton = styled.button`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  padding: 0.8rem 1.2rem;
  background-color: var(--color-red-700);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-red-800);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const PhotoPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1.2rem;
  margin-top: 1.2rem;
`;

const PhotoCard = styled.div`
  position: relative;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  border: 2px solid var(--color-grey-300);

  & img {
    width: 100%;
    height: 15rem;
    object-fit: cover;
  }
`;

const RemovePhotoButton = styled.button`
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-red-700);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-red-800);
    transform: scale(1.1);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const CameraButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.6rem;
  background-color: var(--color-brand-600);
  color: white;
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-brand-700);
  }

  & svg {
    width: 2rem;
    height: 2rem;
  }

  & input {
    display: none;
  }
`;

const LocationInfo = styled.div`
  background-color: var(--color-blue-50);
  padding: 1.6rem;
  border-radius: var(--border-radius-md);
  margin-top: 1.6rem;

  & h4 {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
    color: var(--color-blue-700);
  }

  & p {
    font-size: 1.3rem;
    color: var(--color-blue-700);
    margin: 0.4rem 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
`;

type DeliveryConfirmationProps = {
  deliveryId: string;
  onCloseModal: () => void;
};

function DeliveryConfirmation({
  deliveryId,
  onCloseModal,
}: DeliveryConfirmationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get current location on mount
  useState(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  });

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get signature as base64
    const signatureData = canvas.toDataURL();

    // Check if signature is empty (just check if it's mostly white)
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let isEmpty = true;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
          isEmpty = false;
          break;
        }
      }

      if (isEmpty) {
        alert("Please provide a signature before confirming delivery");
        return;
      }
    }

    const confirmationData = {
      deliveryId,
      recipientName,
      signature: signatureData,
      photos,
      location,
      timestamp: new Date().toISOString(),
      notes,
    };

    console.log("Delivery confirmed:", confirmationData);

    // In a real app, send this to your API
    // await confirmDelivery(confirmationData);

    onCloseModal();
  };

  return (
    <Form type="modal" onSubmit={handleSubmit}>
      <Heading as="h2">✅ Confirm Delivery #{deliveryId}</Heading>

      <FormRow label="Recipient Name">
        <Input
          type="text"
          id="recipientName"
          placeholder="Name of person who received the delivery"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          required
        />
      </FormRow>

      {/* Signature Pad */}
      <div style={{ padding: "1.2rem 0" }}>
        <label
          style={{
            fontWeight: 500,
            display: "block",
            marginBottom: "0.8rem",
            fontSize: "1.4rem",
          }}
        >
          Recipient Signature *
        </label>
        <p
          style={{
            fontSize: "1.3rem",
            color: "var(--color-grey-600)",
            marginBottom: "1.2rem",
          }}
        >
          Please ask the recipient to sign below
        </p>

        <SignatureContainer>
          <SignatureCanvas
            ref={canvasRef}
            width={700}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <ClearButton type="button" onClick={clearSignature}>
            <HiOutlineTrash />
            Clear
          </ClearButton>
        </SignatureContainer>
      </div>

      {/* Photo Capture */}
      <div style={{ padding: "1.2rem 0" }}>
        <label
          style={{
            fontWeight: 500,
            display: "block",
            marginBottom: "0.8rem",
            fontSize: "1.4rem",
          }}
        >
          Delivery Photos (Optional)
        </label>
        <p
          style={{
            fontSize: "1.3rem",
            color: "var(--color-grey-600)",
            marginBottom: "1.2rem",
          }}
        >
          Take photos as proof of delivery
        </p>

        <CameraButton>
          <HiOutlineCamera />
          Take Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handlePhotoCapture}
          />
        </CameraButton>

        {photos.length > 0 && (
          <PhotoPreview>
            {photos.map((photo, index) => (
              <PhotoCard key={index}>
                <img src={photo} alt={`Delivery proof ${index + 1}`} />
                <RemovePhotoButton
                  type="button"
                  onClick={() => removePhoto(index)}
                >
                  <HiOutlineTrash />
                </RemovePhotoButton>
              </PhotoCard>
            ))}
          </PhotoPreview>
        )}
      </div>

      {/* Location Info */}
      {location && (
        <LocationInfo>
          <h4>📍 Delivery Location Verified</h4>
          <p>
            <InfoLabel>Latitude:</InfoLabel> {location.lat.toFixed(6)}
          </p>
          <p>
            <InfoLabel>Longitude:</InfoLabel> {location.lng.toFixed(6)}
          </p>
          <p>
            <InfoLabel>Timestamp:</InfoLabel> {new Date().toLocaleString()}
          </p>
        </LocationInfo>
      )}

      <FormRow label="Additional Notes (Optional)">
        <Textarea
          id="notes"
          placeholder="Any special notes about the delivery..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </FormRow>

      <ButtonGroup>
        <Button type="button" $variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button type="submit">Confirm Delivery</Button>
      </ButtonGroup>
    </Form>
  );
}

export default DeliveryConfirmation;

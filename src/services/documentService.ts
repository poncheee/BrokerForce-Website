import { authService } from "./authService";

export interface Document {
  id: string;
  user_id: string;
  purchase_request_id: string | null;
  offer_id: string | null;
  document_type: "representation_form" | "offer_agreement";
  document_url: string | null;
  signed_at: string | null;
  created_at: string;
}

class DocumentService {
  private baseUrl = authService.getBaseUrl();

  private async fetchWithAuth(url: string, options?: RequestInit) {
    const headers = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Important for session cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || errorData.message || `API error: ${response.status}`
      );
    }

    return response.json();
  }

  async getDocuments(): Promise<Document[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/api/documents`);
    return response.documents || [];
  }

  async getDocumentById(documentId: string): Promise<Document> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}/api/documents/${documentId}`
    );
    return response.document;
  }
}

export const documentService = new DocumentService();

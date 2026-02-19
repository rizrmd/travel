import { Injectable } from "@nestjs/common";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: "added" | "changed" | "deprecated" | "removed" | "fixed" | "security";
    description: string;
  }[];
  breaking: boolean;
}

interface MigrationGuide {
  fromVersion: string;
  toVersion: string;
  steps: string[];
  breaking: boolean;
}

@Injectable()
export class ApiChangelogService {
  private readonly changelog: ChangelogEntry[] = [
    {
      version: "1.0.0",
      date: "2025-12-23",
      changes: [
        { type: "added", description: "Initial public API release" },
        {
          type: "added",
          description: "OAuth 2.0 authentication with client credentials flow",
        },
        {
          type: "added",
          description:
            "RESTful endpoints for Jamaah, Payments, Packages, Documents, Agents",
        },
        { type: "added", description: "Webhook system with retry mechanism" },
        { type: "added", description: "Rate limiting (1,000 requests/hour)" },
        { type: "added", description: "Sandbox environment for testing" },
      ],
      breaking: false,
    },
  ];

  getChangelog(version?: string): ChangelogEntry[] {
    if (version) {
      return this.changelog.filter((entry) => entry.version === version);
    }
    return this.changelog;
  }

  getBreakingChanges(): ChangelogEntry[] {
    return this.changelog.filter((entry) => entry.breaking);
  }

  getMigrationGuide(fromVersion: string, toVersion: string): MigrationGuide {
    // Example migration guide
    return {
      fromVersion,
      toVersion,
      steps: [
        "Update your API client library to the latest version",
        "Review breaking changes in the changelog",
        "Update authentication credentials if needed",
        "Test all API calls in sandbox environment",
        "Deploy to production",
      ],
      breaking: false,
    };
  }

  getLatestVersion(): string {
    return this.changelog[0]?.version || "1.0.0";
  }

  getSupportedVersions(): string[] {
    return this.changelog.map((entry) => entry.version);
  }
}

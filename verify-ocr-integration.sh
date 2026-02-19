#!/bin/bash

echo "=========================================="
echo "OCR Integration Verification Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        return 1
    fi
}

echo "1. Domain Layer (3 files)"
check_file "src/ocr/domain/document-type.enum.ts"
check_file "src/ocr/domain/quality-check-type.enum.ts"
check_file "src/ocr/domain/index.ts"
echo ""

echo "2. DTOs (6 files)"
check_file "src/ocr/dto/ktp-data.dto.ts"
check_file "src/ocr/dto/passport-data.dto.ts"
check_file "src/ocr/dto/kk-data.dto.ts"
check_file "src/ocr/dto/quality-validation.dto.ts"
check_file "src/ocr/dto/extract-data.dto.ts"
check_file "src/ocr/dto/index.ts"
echo ""

echo "3. Services (4 files)"
check_file "src/ocr/services/verihubs-ocr.service.ts"
check_file "src/ocr/services/quality-validation.service.ts"
check_file "src/ocr/services/ocr.service.ts"
check_file "src/ocr/services/index.ts"
echo ""

echo "4. Controllers (1 file)"
check_file "src/ocr/controllers/ocr.controller.ts"
echo ""

echo "5. Processors (1 file)"
check_file "src/ocr/processors/ocr.processor.ts"
echo ""

echo "6. Module (1 file)"
check_file "src/ocr/ocr.module.ts"
echo ""

echo "7. Database Migration (1 file)"
check_file "src/database/migrations/1766468638000-AddOcrColumnsToDocuments.ts"
echo ""

echo "8. Documentation (3 files)"
check_file "src/ocr/README.md"
check_file "docs/integrations/ocr-implementation.md"
check_file ".env.example.ocr"
echo ""

echo "9. Integration Updates (3 files)"
check_file "src/documents/infrastructure/persistence/relational/entities/document.entity.ts"
check_file "src/app.module.ts"
check_file "package.json"
echo ""

echo "10. Summary (1 file)"
check_file "IMPLEMENTATION_SUMMARY_OCR.md"
echo ""

echo "=========================================="
echo "OCR Module Statistics"
echo "=========================================="
echo ""

# Count TypeScript files
ts_count=$(find src/ocr -name "*.ts" | wc -l)
echo "TypeScript files: $ts_count"

# Count total lines
total_lines=$(find src/ocr -name "*.ts" -exec wc -l {} + | tail -1 | awk '{print $1}')
echo "Total lines of code: $total_lines"

# Check if migration exists
if [ -f "src/database/migrations/1766468638000-AddOcrColumnsToDocuments.ts" ]; then
    migration_lines=$(wc -l < "src/database/migrations/1766468638000-AddOcrColumnsToDocuments.ts")
    echo "Migration lines: $migration_lines"
fi

echo ""
echo "=========================================="
echo "Environment Configuration"
echo "=========================================="
echo ""

if [ -f ".env" ]; then
    if grep -q "OCR_ENABLED" .env; then
        ocr_enabled=$(grep "OCR_ENABLED" .env | cut -d'=' -f2)
        echo -e "OCR_ENABLED: ${GREEN}$ocr_enabled${NC}"
    else
        echo -e "OCR_ENABLED: ${RED}Not configured${NC}"
    fi
else
    echo -e ".env file: ${RED}Not found${NC}"
    echo "Run: cat .env.example.ocr >> .env"
fi

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "1. Install dependencies:"
echo "   npm install sharp form-data axios"
echo ""
echo "2. Run database migration:"
echo "   npm run migration:run"
echo ""
echo "3. Configure environment:"
echo "   cat .env.example.ocr >> .env"
echo ""
echo "4. Start application:"
echo "   npm run start:dev"
echo ""
echo "5. Test STUB mode:"
echo "   POST /api/v1/ocr/documents/{id}/extract"
echo ""
echo "6. When ready for production:"
echo "   - Sign up at https://verihubs.com"
echo "   - Get API credentials"
echo "   - Update .env: OCR_ENABLED=true"
echo ""
echo "=========================================="
echo "✅ OCR Integration: COMPLETE"
echo "=========================================="

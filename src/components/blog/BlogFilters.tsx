import { BlockStack, Card, Text, Checkbox, Button, TextField, Tag, InlineStack } from "@shopify/polaris"
import { useState, useEffect, useCallback, useRef } from "react"

type Category = {
    id: number
    documentId: string
    name: string
}

type BlogFiltersProps = {
    categories: Category[]
    selectedCategoryIds: string[]
    onCategoryChange: (categoryIds: string[]) => void
    years: number[]
    selectedYears: number[]
    onYearChange: (years: number[]) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    onClearFilters: () => void
}

export const BlogFilters = ({ 
    categories, 
    selectedCategoryIds, 
    onCategoryChange,
    years,
    selectedYears,
    onYearChange,
    searchQuery,
    onSearchChange,
    onClearFilters 
}: BlogFiltersProps) => {
    // Local state for immediate UI updates
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
    
    // Debounce timer ref
    const debounceTimer = useRef<number | null>(null)

    // Sync local state when parent search query changes (e.g., from clear filters)
    useEffect(() => {
        setLocalSearchQuery(searchQuery)
        // Clear any pending debounce timer when parent query changes externally
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
            debounceTimer.current = null
        }
    }, [searchQuery])

    // Debounced search handler
    const handleSearchChange = useCallback((value: string) => {
        // Update local state immediately for responsive UI
        setLocalSearchQuery(value)

        // Clear existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        // Set new debounce timer (300ms delay)
        debounceTimer.current = setTimeout(() => {
            onSearchChange(value)
        }, 300)
    }, [onSearchChange])

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
            }
        }
    }, [])

    const handleCategoryToggle = useCallback((categoryDocumentId: string) => {
        if (selectedCategoryIds.includes(categoryDocumentId)) {
            onCategoryChange(selectedCategoryIds.filter(id => id !== categoryDocumentId))
        } else {
            onCategoryChange([...selectedCategoryIds, categoryDocumentId])
        }
    }, [selectedCategoryIds, onCategoryChange])

    const handleYearToggle = useCallback((year: number) => {
        if (selectedYears.includes(year)) {
            onYearChange(selectedYears.filter(y => y !== year))
        } else {
            onYearChange([...selectedYears, year])
        }
    }, [selectedYears, onYearChange])

    const handleCategoryRemove = useCallback((categoryDocumentId: string) => {
        onCategoryChange(selectedCategoryIds.filter(id => id !== categoryDocumentId))
    }, [selectedCategoryIds, onCategoryChange])

    const handleYearRemove = useCallback((year: number) => {
        onYearChange(selectedYears.filter(y => y !== year))
    }, [selectedYears, onYearChange])

    const hasActiveFilters = selectedCategoryIds.length > 0 || selectedYears.length > 0 || searchQuery.trim() !== ''

    return (
        <Card>
            <BlockStack gap="400">
                {hasActiveFilters && (
                    <Button 
                        variant="plain" 
                        onClick={onClearFilters}
                        size="slim"
                    >
                        Clear all
                    </Button>
                )}

                {/* Search Section */}
                <BlockStack gap="300">
                    <Text variant="headingSm" as="h4">
                        Search
                    </Text>
                    <TextField
                        label=""
                        value={localSearchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search posts..."
                        autoComplete="off"
                        clearButton
                        onClearButtonClick={() => handleSearchChange('')}
                    />
                </BlockStack>

                {/* Category Filter Section */}
                {categories.length > 0 && (
                    <BlockStack gap="300">
                        <Text variant="headingSm" as="h4">
                            Categories
                        </Text>
                        
                        {/* Selected Category Tags */}
                        {selectedCategoryIds.length > 0 && (
                            <InlineStack gap="200" wrap>
                                {selectedCategoryIds.map((categoryId) => {
                                    const category = categories.find(c => c.documentId === categoryId)
                                    return category ? (
                                        <Tag key={categoryId} onRemove={() => handleCategoryRemove(categoryId)}>
                                            {category.name}
                                        </Tag>
                                    ) : null
                                })}
                            </InlineStack>
                        )}
                        
                        {/* Category Checkboxes */}
                        <BlockStack gap="200">
                            {categories.map((category) => (
                                <Checkbox
                                    key={category.documentId}
                                    label={category.name}
                                    checked={selectedCategoryIds.includes(category.documentId)}
                                    onChange={() => handleCategoryToggle(category.documentId)}
                                />
                            ))}
                        </BlockStack>
                    </BlockStack>
                )}

                {/* Year Filter Section */}
                {years.length > 0 && (
                    <BlockStack gap="300">
                        <Text variant="headingSm" as="h4">
                            Year
                        </Text>
                        
                        {/* Selected Year Tags */}
                        {selectedYears.length > 0 && (
                            <InlineStack gap="200" wrap>
                                {selectedYears.map((year) => (
                                    <Tag key={year} onRemove={() => handleYearRemove(year)}>
                                        {String(year)}
                                    </Tag>
                                ))}
                            </InlineStack>
                        )}
                        
                        {/* Year Checkboxes */}
                        <BlockStack gap="200">
                            {years.map((year) => (
                                <Checkbox
                                    key={year}
                                    label={String(year)}
                                    checked={selectedYears.includes(year)}
                                    onChange={() => handleYearToggle(year)}
                                />
                            ))}
                        </BlockStack>
                    </BlockStack>
                )}
            </BlockStack>
        </Card>
    )
}
import type { VueCodeInformation } from '../types';
declare const raw: {
    all: {
        verification: true;
        completion: true;
        semantic: true;
        navigation: true;
    };
    verification: {
        verification: true;
    };
    completion: {
        completion: true;
    };
    additionalCompletion: {
        completion: {
            isAdditional: true;
        };
    };
    withoutCompletion: {
        verification: true;
        semantic: true;
        navigation: true;
    };
    navigation: {
        navigation: true;
    };
    navigationWithoutHighlight: {
        navigation: {
            shouldHighlight: () => false;
        };
    };
    navigationWithoutRename: {
        navigation: {
            shouldRename: () => false;
        };
    };
    navigationAndAdditionalCompletion: {
        navigation: true;
        completion: {
            isAdditional: true;
        };
    };
    navigationAndVerification: {
        navigation: true;
        verification: true;
    };
    withoutNavigation: {
        verification: true;
        completion: true;
        semantic: true;
    };
    semanticWithoutHighlight: {
        semantic: {
            shouldHighlight: () => false;
        };
    };
    withoutHighlight: {
        semantic: {
            shouldHighlight: () => false;
        };
        verification: true;
        navigation: true;
        completion: true;
    };
    withoutHighlightAndCompletion: {
        semantic: {
            shouldHighlight: () => false;
        };
        verification: true;
        navigation: true;
    };
    withoutSemantic: {
        verification: true;
        navigation: true;
        completion: true;
    };
    doNotReportTs2339AndTs2551: {
        verification: {
            shouldReport: (_source: string | undefined, code: string | number | undefined) => boolean;
        };
    };
    doNotReportTs2353AndTs2561: {
        verification: {
            shouldReport: (_source: string | undefined, code: string | number | undefined) => boolean;
        };
    };
    doNotReportTs6133: {
        verification: {
            shouldReport: (_source: string | undefined, code: string | number | undefined) => boolean;
        };
    };
};
export declare const codeFeatures: { [K in keyof typeof raw]: VueCodeInformation; };
export {};

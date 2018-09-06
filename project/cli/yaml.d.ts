declare module "yaml/parse-cst" {
  import YAML from "yaml";
  export default function parse(src: string): YAML.Document[];
}

declare module "yaml/seq" {
  import YAML from "yaml";
  import Pair from "yaml/pair";

  export default class Seq extends YAML.Node {
    type: "SEQ";
    items: Array<YAML.Comment | YAML.SeqItem | Pair>;
  }
}

declare module "yaml/map" {
  import YAML from "yaml";
  import Pair from "yaml/pair";
  export default class Map extends YAML.Node {
    type: "MAP";
    items: Pair[];
  }
}

declare module "yaml/pair" {
  import YAML from "yaml";
  export default class Pair extends YAML.Node {
    constructor(public key: any, public value: any = null);
    commentBefore: string | undefined;
    comment: string | undefined;
    readonly stringKey: string;
    toJSON(): {};
    toString(): string;
  }
}

declare module "yaml" {

  import Seq from "yaml/seq";
  import Map from "yaml/map";
  import Pair from "yaml/pair";

  export default YAML;
  namespace YAML {

    export let defaultOptions = { keepBlobsInJSON: true, keepNodeTypes: true, version: '1.2' };

    /**
     * May throw on error, and it may log warnings using console.warn. It only supports input consisting of a single YAML document;for multi-document support you should use YAML.parseAllDocuments
     * @param str Should be a string with YAML formatting.
     * @returns The value will match the type of the root value of the parsed YAML document, so Maps become objects, Sequences arrays, and scalars result in nulls, booleans, numbers and strings.
     */
    export function parse(str: string, options?: ParseOptions): any;

    /**
     * @returns Will always include \n as the last character, as is expected of YAML documents.
     */
    export function stringify(value: any, options?: ParseOptions): string;

    /**
     * Parses a single YAML.Document from the input str; used internally by YAML.parse.
     * Will include an error if str contains more than one document.
     */
    export function parseDocument(str: string, options?: ParseOptions): Document;

    /**
     * When parsing YAML, the input string str may consist of a stream of documents separated from each other by ... document end marker lines.
     * @returns An array of Document objects that allow these documents to be parsed and manipulated with more control.
     */
    export function parseAllDocuments(str: string, options?: ParseOptions): Document[];

    /**
     * YAML.createNode recursively turns objects into Map and arrays to Seq collections.
     * Its primary use is to enable attaching comments or other metadata to a value, or to otherwise exert more fine-grained control over the stringified output.
     * Wraps plain values in Scalar objects.
     */
    export function createNode(value: any): Map | Seq | YAML.Scalar;

    /**
     * YAML.createNode recursively turns objects into Map and arrays to Seq collections.
     * Its primary use is to enable attaching comments or other metadata to a value, or to otherwise exert more fine-grained control over the stringified output.
     * Doesn't wrap plain values in Scalar objects.
     */
    export function createNode(value: any, wrapScalars: false): Map | Seq | string | number | boolean | null;

    interface Prefix {
      handle: string;
      prefix: string;
    }

    export class Document extends Node {

      constructor(options?: {});

      /**
       * Anchors associated with the document's nodes; also provides alias & merge node creators.
       */
      readonly anchors: Anchors;

      /**
       * A comment at the very beginning of the document.
       */
      commentBefore: string | null;

      /**
       * A comment at the end of the document.
       */
      comment: string | null;

      /**
       * The document contents.
       */
      contents: ContentNode | null;

      /**
       * Errors encountered during parsing.
       */
      readonly errors: YAMLError[];

      /**
       * The schema used with the document.
       */
      readonly schema: Schema | null;

      /**
       * Array of prefixes; each will have a string handle that starts and ends with ! and a string prefix that the handle will be replaced by.
       */
      readonly tagPrefixes: Prefix[];

      /**
       * The parsed version of the source document; if true-ish, stringified output will include a %YAML directive.
       */
      version: string | null;

      /**
       * Warnings encountered during parsing.
       */
      readonly warnings: Error[];

      /**
       * List the tags used in the document that are not in the default tag:yaml.org,2002: namespace.
       */
      listNonDefaultTags(): string[];

      /**
       * Parse a CST into this document
       */
      parse(document: any): this;

      /**
       * Set handle as a shorthand string for the prefix tag namespace.
       */
      setTagPrefix(handle: string, prefix: string);

      /**
       * A plain JavaScript representation of the document contents.
       */
      toJSON(): string;

      /**
       * A YAML representation of the document.
       */
      toString(): string;

      static defaults: {
        '1.0': { merge: true, schema: 'yaml-1.1' },
        '1.1': { merge: true, schema: 'yaml-1.1' },
        '1.2': { merge: false, schema: 'core' }
      };
    }

    class Schema {
      merge: boolean;
      name: string;
      schema: any[];
    }

    class Anchors {
      /**
       * Create a new Alias node, adding the required anchor for node. If name is empty, a new anchor name will be generated.
       */
      createAlias(node: Node, name?: string): Alias;

      /**
       * Create a new Merge node with the given source nodes.Non - Alias sources will be automatically wrapped.
       */
      createMergePair(...sources: Node[]): Merge;

      /**
       * The anchor name associated with node, if set.
       */
      getName(node: Node): string?;

      /**
       * The node associated with the anchor name, if set.
       */
      getNode(name: string): Node?;

      /**
       * Find an available anchor name with the given prefix and a numerical suffix.
       */
      newName(prefix: string): string;

      /**
       * Associate an anchor with node. If name is empty, a new name will be generated.
       */
      setAnchor(node: Node, name?: string): string?;
    }

    type YAMLError = YAMLSyntaxError | YAMLSemanticError | YAMLReferenceError;

    interface ParseOptions {
      /**
       * Allow non-JSON JavaScript objects to remain in the toJSON output. Relevant with the YAML 1.1 !!timestamp and !!binary tags. By default true.
       * @default true
       */
      keepBlobsInJSON?: boolean;

      /**
       * Include references in the AST to each node's corresponding CST node. By default false.
       * @default false
       */
      keepCstNodes?: boolean;

      /**
       * Store the original node type when parsing documents.By default true.
       * @default true
       */
      keepNodeTypes?: boolean;

      /**
       * Enable support for << merge keys.
       */
      merge?: boolean;

      /**
       * The base schema to use.By default 'core' for YAML 1.2 and 'yaml-1.1' for earlier versions.
       * @default 'core'
       */
      schema?: 'core' | 'failsafe' | 'json' | 'yaml-1.1';

      /**
       * Array of additional(custom) tags to include in the schema
       */
      tags?: Tag[] | function;

      /**
       * The YAML version used by documents without a % YAML directive.By default '1.2'.
       * @default '1.2'
       */
      version?: string;
    }

    interface YAMLSyntaxError extends SyntaxError {
      name: "YAMLSyntaxError";
      source: yaml.Node;
    }
    interface YAMLSemanticError extends SyntaxError {
      name: "YAMLSemanticError";
      source: yaml.Node;
    }
    interface YAMLReferenceError extends ReferenceError {
      name: "YAMLReferenceError";
      source: yaml.Node;
    }

    interface Range {
      start: number;
      end: number;
      readonly length: number;
      readonly isEmpty: boolean;
    }

    interface ParseContext {
      /** Node starts at beginning of line */
      atLineStart: boolean;
      /** true if currently in a collection context */
      inCollection: boolean;
      /** true if currently in a flow context */
      inFlow: boolean;
      /** Current level of indentation */
      indent: number;
      /** Start of the current line */
      lineStart: number;
      /** The parent of the node */
      parent: Node;
      /** Source of the YAML document */
      src: string;
    }

    interface Node {
      context: ParseContext | null;
      /** if not null, indicates a parser failure */
      error: YAMLSyntaxError | null;
      /** span of context.src parsed into this node */
      range: Range | null;
      valueRange: Range | null;
      /** anchors, tags and comments */
      props: Range[];
      /** specific node type */
      type: string;
      /** if non-null, overrides source value */
      value: string | null;

      readonly anchor: string | null;
      readonly comment: string | null;
      readonly hasComment: boolean;
      readonly hasProps: boolean;
      readonly jsonLike: boolean;
      readonly rawValue: string | null;
      readonly tag: null | { verbatim: string } | { handle: string; suffix: string };
      readonly valueRangeContainsNewline: boolean;
    }

    interface Alias extends Node {
      type: "ALIAS";
      /** contain the anchor without the * prefix */
      readonly rawValue: string;
    }

    type Scalar = BlockValue | PlainValue | QuoteValue;

    interface BlockValue extends Node {
      type: "BLOCK_FOLDED" | "BLOCK_LITERAL";
      chomping: "CLIP" | "KEEP" | "STRIP";
      blockIndent: number | null;
      header: Range;
      readonly strValue: string | null;
    }

    interface PlainValue extends Node {
      type: "PLAIN";
      readonly strValue: string | null;
    }

    interface QuoteValue extends Node {
      type: "QUOTE_DOUBLE" | "QUOTE_SINGLE";
      readonly strValue:
        | null
        | string
        | { str: string; errors: YAMLSyntaxError[] };
    }

    interface Comment extends Node {
      type: "COMMENT";
      readonly anchor: null;
      readonly comment: string;
      readonly rawValue: null;
      readonly tag: null;
    }

    interface MapItem extends Node {
      type: "MAP_KEY" | "MAP_VALUE";
      node: ContentNode | null;
    }

    interface SeqItem extends Node {
      type: "SEQ_ITEM";
      node: ContentNode | null;
    }

    type FlowChar = "{" | "}" | "[" | "]" | "," | "?" | ":";

    interface FlowCollection extends Node {
      type: "FLOW_MAP" | "FLOW_SEQ";
      items: Array<FlowChar | Comment | Alias | Scalar | FlowCollection>;
    }

    type ContentNode = Node | Comment | Alias | Scalar | Map | Seq | FlowCollection;

    interface Directive extends Node {
      type: "DIRECTIVE";
      name: string;
      readonly anchor: null;
      readonly parameters: string[];
      readonly tag: null;
    }
  }
}
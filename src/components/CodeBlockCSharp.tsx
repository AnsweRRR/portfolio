type TokenType = "keyword" | "type" | "identifier" | "string";

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "text-purple-400",
  type: "text-blue-300",
  identifier: "text-cyan-400",
  string: "text-orange-400",
};

const Token = ({ type, children }: { type: TokenType; children: React.ReactNode }) => (
  <span className={TOKEN_COLORS[type]}>{children}</span>
);

const WindowControls = () => {
  const colors = ["bg-red-500", "bg-yellow-500", "bg-green-500"];
  return (
    <div className="flex gap-2">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${color} hover:scale-110 transition-transform cursor-pointer`}
        />
      ))}
    </div>
  );
};

const renderProperty = (type: string, name: string, value: string) => (
  <>
    {"\n"}  <Token type="keyword">public</Token>{" "}
    <Token type="type">{type}</Token>{" "}
    <Token type="identifier">{name}</Token>{" "}
    &#123; <Token type="keyword">get</Token>; <Token type="keyword">set</Token>; &#125; ={" "}
    <Token type="string">"{value}"</Token>;
  </>
);

const CodeBlockCSharp = () => {
  return (
    <div className="code-window overflow-hidden shadow-2xl hover:shadow-cyan-500/50 dark:hover:shadow-purple-500/50 transition-all duration-500 group hover:scale-105 hover:rotate-1">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-200 dark:bg-slate-800 border-b border-gray-300 dark:border-slate-700">
        <WindowControls />
        <span className="text-gray-600 dark:text-slate-400 text-sm ml-2">Developer.cs</span>
        <div className="ml-auto">
          <span className="text-xs text-green-500 dark:text-green-400 animate-pulse">● Running</span>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-x-auto custom-scrollbar">
        <pre className="text-gray-800 dark:text-slate-300 text-sm leading-relaxed whitespace-pre">
          <Token type="keyword">public</Token>{" "}
          <Token type="keyword">class</Token>{" "}
          <Token type="identifier">Developer</Token>
          {"\n"}&#123;
          {renderProperty("string", "FirstName", "Tamás")}
          {renderProperty("string", "LastName", "Pogrányi")}
          {renderProperty("string", "Role", "Software Developer")}
          {"\n"}  <Token type="keyword">public</Token>{" "}
          <Token type="type">IList&lt;string&gt;</Token>{" "}
          <Token type="identifier">Skills</Token>{" "}
          &#123; <Token type="keyword">get</Token>; <Token type="keyword">set</Token>; &#125; =
          {"\n"}    <Token type="keyword">new</Token>(){" "}
          &#123;{" "}
          <Token type="string">".NET"</Token>,{" "}
          <Token type="string">"React"</Token>,{" "}
          <Token type="string">"React Native"</Token>{" "}
          &#125;;
          {"\n"}&#125;
        </pre>
      </div>
    </div>
  );
};

export default CodeBlockCSharp;
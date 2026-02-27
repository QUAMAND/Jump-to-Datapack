hljs.registerLanguage('mcfunction', () => ({
    contains: [
        { className: 'comment', begin: /^#.*/, relevance: 0 },
        { className: 'string', begin: /"/, end: /"/ },
        { className: 'number', begin: /\b-?\d+(\.\d+)?\b/ },
        { className: 'selector', begin: /@[paresn]/ },
        { className: 'keyword', begin: /\b(?:advancement|attribute|clear|clone|damage|data|datapack|effect|enchant|execute|experience|fill|function|gamemode|gamerule|give|item|kill|locate|loot|particle|place|playsound|recipe|reload|return|ride|say|schedule|scoreboard|setblock|summon|tag|team|teleport|tell|tellraw|time|title|tp|trigger|weather|worldborder|xp)\b/ },
        { className: 'namespace', begin: /minecraft:[a-z0-9_\/]+/ },
        { className: 'bracket', begin: /[\[\]]/ },
    ]
}))
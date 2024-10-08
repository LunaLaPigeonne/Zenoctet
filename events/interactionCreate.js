const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
            if (!interaction.isCommand()) return;
        
            const command = client.commands.get(interaction.commandName);
        
            if (!command) return;
        
            console.log(`[XenoLog] Command '${interaction.commandName}' requested by ${interaction.user.tag}`);
        
            // Vérification des permissions
            if (command.ownerOnly && interaction.user.id !== process.env.BOT_OWNER_ID) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée au propriétaire du bot.', ephemeral: true });
            }
        
            if (command.devOnly && interaction.user.id !== process.env.BOT_DEV_ID) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée aux développeurs du bot.', ephemeral: true });
            }
        
            if (command.adminOnly && !interaction.member.permissions.has('ADMINISTRATOR')) {
                console.log(`[XenoLog] La commande '${interaction.commandName}' demandée par ${interaction.user.tag} a été refusée.`);
                return interaction.reply({ content: 'Cette commande est réservée aux administrateurs.', ephemeral: true });
            }
        
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`[XenoError] Erreur lors de l'exécution de la commande '${interaction.commandName}' :`, error);
                const embed = new EmbedBuilder()
                    .setColor("DarkRed")
                    .setTitle('🛑 Erreur')
                    .setDescription('Une erreur est survenue lors de l\'exécution de cette commande.');
                interaction.reply({ embeds: [embed] });
            }

        if (interaction.isButton() && interaction.customId === 'fill_form') {
            // Afficher le modal
            const modal = new ModalBuilder()
                .setCustomId('form_modal')
                .setTitle('Formulaire d\'inscription');

            const firstNameInput = new TextInputBuilder()
                .setCustomId('first_name')
                .setLabel('Prénom')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const lastNameInput = new TextInputBuilder()
                .setCustomId('last_name')
                .setLabel('Nom')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const groupInput = new TextInputBuilder()
                .setCustomId('group')
                .setLabel('Groupe (C1 ou C2)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const firstNameRow = new ActionRowBuilder().addComponents(firstNameInput);
            const lastNameRow = new ActionRowBuilder().addComponents(lastNameInput);
            const groupRow = new ActionRowBuilder().addComponents(groupInput);

            modal.addComponents(firstNameRow, lastNameRow, groupRow);

            await interaction.showModal(modal);
        } else if (interaction.isModalSubmit() && interaction.customId === 'form_modal') {
            // Gérer la soumission du modal
            const firstName = interaction.fields.getTextInputValue('first_name');
            const lastName = interaction.fields.getTextInputValue('last_name');
            const group = interaction.fields.getTextInputValue('group');

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Nouvelle Inscription')
                .addFields(
                    { name: 'Prénom', value: firstName, inline: true },
                    { name: 'Nom', value: lastName, inline: true },
                    { name: 'Groupe', value: group, inline: true },
                    { name: 'UserID', value: interaction.user.id, inline: true } // Ajout de l'ID utilisateur
                );

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept_entry')
                .setLabel('Accepter')
                .setStyle(ButtonStyle.Success);

            const rejectButton = new ButtonBuilder()
                .setCustomId('reject_entry')
                .setLabel('Refuser')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);

            const channel = interaction.client.channels.cache.get('1291074777334677587');
            if (channel) {
                await channel.send({ embeds: [embed], components: [row] });
            }

            await interaction.reply({ content: 'Votre formulaire a été soumis avec succès.', ephemeral: true });
        } else if (interaction.isButton() && (interaction.customId === 'accept_entry' || interaction.customId === 'reject_entry')) {
            // Gérer les interactions avec les boutons d'acceptation et de refus
            const embed = interaction.message.embeds[0];
            const firstName = embed.fields.find(field => field.name === 'Prénom').value;
            const lastName = embed.fields.find(field => field.name === 'Nom').value;
            const group = embed.fields.find(field => field.name === 'Groupe').value;
            const userId = embed.fields.find(field => field.name === 'UserID').value; // Récupérer l'ID utilisateur

            const guild = interaction.guild;
            const member = guild.members.cache.get(userId);
            const user = await interaction.client.users.fetch(userId);
            if (!user) {
                return interaction.reply({ content: 'Utilisateur non trouvé.', ephemeral: true });
            }

            if (interaction.customId === 'accept_entry') {
                const roleId = '1283104919968022661';
                await member.roles.add(roleId);

                // Formater le prénom et le nom de famille
                const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                const formattedLastName = lastName.charAt(0).toUpperCase() + '.';
                const newNickname = `${formattedFirstName} ${formattedLastName}`;

                // Renommer le membre
                await member.setNickname(newNickname);

                await user.send(`Votre entrée a été acceptée. Votre rôle a été ajouté et votre pseudonyme a été mis à jour !`);

                const updatedEmbed = EmbedBuilder.from(embed)
                    .setColor('Green')
                    .setTitle('Inscription Acceptée');

                await interaction.update({ embeds: [updatedEmbed], content: 'Entrée acceptée, rôle ajouté et pseudonyme mis à jour.', components: [] });

                // Envoyer le message de bienvenue dans le salon approprié
                const welcomeChannel = interaction.client.channels.cache.get('1290613693243068426');
                if (welcomeChannel) {
                    const welcomeEmbed = new EmbedBuilder()
                        .setColor('Blue')
                        .setTitle('Bienvenue !')
                        .setDescription(`Bienvenue à ${user} sur le serveur ! Nous sommes désormais ${guild.memberCount} membres !`)

                    await welcomeChannel.send({ embeds: [welcomeEmbed] });
                }
            } else if (interaction.customId === 'reject_entry') {
                // Afficher le modal pour la raison du refus
                const reasonModal = new ModalBuilder()
                    .setCustomId('reason_modal')
                    .setTitle('Raison du refus');

                const reasonInput = new TextInputBuilder()
                    .setCustomId('reason')
                    .setLabel('Raison du refus')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const reasonRow = new ActionRowBuilder().addComponents(reasonInput);
                reasonModal.addComponents(reasonRow);

                await interaction.showModal(reasonModal);
            }
        } else if (interaction.isModalSubmit() && interaction.customId === 'reason_modal') {
            // Gérer la soumission du modal de raison du refus
            const reason = interaction.fields.getTextInputValue('reason');
            const embed = interaction.message.embeds[0];
            const firstName = embed.fields.find(field => field.name === 'Prénom').value;
            const lastName = embed.fields.find(field => field.name === 'Nom').value;
            const group = embed.fields.find(field => field.name === 'Groupe').value;
            const userId = embed.fields.find(field => field.name === 'UserID').value; // Récupérer l'ID utilisateur

            const guild = interaction.guild;
            const member = guild.members.cache.get(userId);
            const user = await interaction.client.users.fetch(userId);
            if (!user) {
                return interaction.reply({ content: 'Utilisateur non trouvé.', ephemeral: true });
            }

            await user.send(`Votre entrée a été refusée pour la raison suivante : ${reason}`);

            const updatedEmbed = EmbedBuilder.from(embed)
                .setColor('Red')
                .setTitle('Inscription Refusée')
                .addFields({ name: 'Raison du refus', value: reason });

            await interaction.update({ embeds: [updatedEmbed], content: 'Entrée refusée.', components: [] });

            // Expulser l'utilisateur après 10 secondes
            setTimeout(async () => {
                await member.kick(reason);
            }, 10000);
        }
    }
};
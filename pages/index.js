import Loading from '@/components/loading';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import { useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { HiX } from 'react-icons/hi';

export default function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const [gotResults, setGotResults] = useState(false);
	const [gotError, setGotError] = useState(false);
	const [ideasValue, setIdeasValue] = useState([]);

	// Gender input and selection box
	const [selectedGender, setSelectedGender] = useState('');
	const [openGender, setOpenGender] = useState(false);
	const [genderError, setGenderError] = useState(false);

	// Relation input and selection box
	const [selectedRole, setSelectedRole] = useState('');
	const [openRole, setOpenRole] = useState(false);
	const [roleError, setRoleError] = useState(false);

	// Occasion input and selection box
	const [selectedOccasion, setSelectedOccasion] = useState('');
	const [openOccasion, setOpenOccasion] = useState(false);
	const [occasionError, setOccasionError] = useState(false);

	// Age input
	const [ageValue, setAgeValue] = useState('');
	const [ageError, setAgeError] = useState(false);

	const [occupation, setOccupation] = useState('');

	// Declaration of tags array
	const [tags, setTags] = useState([]);
	const [tagsError, setTagsError] = useState(false);
	//Function for processing the tags
	function handleKeydown(e) {
		if (e.key !== 'Enter') {
			setTagsError(false);
			return;
		}
		const value = e.target.value;
		if (!value.trim()) {
			return;
		}
		if (tags.includes(value)) {
			e.target.value = '';
			return;
		}
		setTags([...tags, value]);
		e.target.value = '';
	}
	// Function from removing tags from array by clicking the X
	function removeTag(index) {
		setTags(tags.filter((el, i) => i !== index));
	}

	// To prevent submitting the form on Enter
	// Because it is used to input tags to array
	const handleKeydownForm = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	// Submitting form
	const getIdeas = async (e) => {
		e.preventDefault();

		// Error conditions
		var inputerror = false;
		if (!selectedGender) {
			setGenderError(true);
			inputerror = true;
		}
		if (!selectedRole) {
			setRoleError(true);
			inputerror = true;
		}
		if (!selectedOccasion) {
			setOccasionError(true);
			inputerror = true;
		}
		if (!ageValue) {
			setAgeError(true);
			inputerror = true;
		}
		if (tags.length <= 2) {
			setTagsError(true);
			inputerror = true;
		}

		// If there is no error, data gets sent to API
		if (!inputerror) {
			setIsLoading(true);
			const body = {
				occasion: selectedOccasion,
				gender: selectedGender,
				role: selectedRole,
				occupation: occupation,
				age: ageValue,
				interests: tags,
			};
			const res = await fetch('/api/getideas', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
			const suggestions = await res.json();
			console.log(suggestions.result);
			if (suggestions.result) {
				setIdeasValue(JSON.parse(suggestions.result));
				console.log(suggestions.id);
			} else {
				setGotError(true);
			}
			setGotResults(true);
			setIsLoading(false);
		}
	};

	return (
		<>
			<Head>
				<title>Generate Gift Ideas</title>
			</Head>
			{isLoading ? (
				<Loading />
			) : gotResults ? (
				gotError ? (
					<>error</>
				) : (
					<section className={styles.generatedsection}>
						<h1>Here are your ideas:</h1>
						<div className={styles.ideasgrid}>
							{' '}
							{ideasValue.map((item, index) => (
								<a
									target="_blank"
									rel="noreferrer nofollow noopener"
									className={styles.idealink}
									href={'https://www.amazon.com/s?k=' + item}
									key={index}
								>
									<div className={styles.idea}>
										<h2>{item}</h2>
									</div>
								</a>
							))}
						</div>
					</section>
				)
			) : (
				<section className={styles.ideapage}>
					<div className={styles.formarea}>
						<form onKeyDown={handleKeydownForm} onSubmit={getIdeas}>
							<div className={styles.innerform}>
							<div className={styles.inputgroup}>
									<label>
										<span className={styles.important}>*</span>What is the occasion?{' '}
									</label>
									<div
										onClick={() => {
											setOpenOccasion(!openOccasion);
											setOpenRole(false);
											setOpenGender(false);
											setOccasionError(false);
										}}
										className={styles.dropdown}
										style={{
											border: occasionError && ' 2px solid red',
											borderRadius: openOccasion ? '10px 10px 0px 0px' : '10px',
										}}
									>
										<span>{selectedOccasion ? selectedOccasion : 'select'}</span>
										<BiChevronDown size={25} />
									</div>
									<ul
										style={{ display: openOccasion ? 'block' : 'none' }}
										className={styles.dropdownitems}
									>
										<li
											onClick={() => {
												setSelectedOccasion('just because');
												setOpenOccasion(false);
											}}
										>
											Just because
										</li>
										<li
											onClick={() => {
												setSelectedOccasion('birthday');
												setOpenOccasion(false);
											}}
										>
											Birthday
										</li>
										<li
											onClick={() => {
												setSelectedOccasion('christmas');
												setOpenOccasion(false);
											}}
										>
											Christmas
										</li>
										<li
											onClick={() => {
												setSelectedOccasion('nameday');
												setOpenOccasion(false);
											}}
										>
											Nameday
										</li>
										<li
											onClick={() => {
												setSelectedOccasion('wedding');
												setOpenOccasion(false);
											}}
										>
											Wedding
										</li>
										<li
											onClick={() => {
												setSelectedOccasion('anniversary');
												setOpenOccasion(false);
											}}
										>
											Anniversary
										</li>
										<li
											onClick={() => {
												setSelectedOccasion('graduation');
												setOpenOccasion(false);
											}}
										>
											Graduation
										</li>
										<li
											onClick={() => {
												setSelectedOccasion('pregnancy');
												setOpenOccasion(false);
											}}
										>
											Pregnancy
										</li>
										<li
											onClick={() => {
												setSelectedOccasion('other important day');
												setOpenOccasion(false);
											}}
										>
											Other important day
										</li>
									</ul>
								</div>
								{/* Gender input */}
								<div className={styles.inputgroup}>
									<label>
										<span className={styles.important}>*</span>Select the gender
										of the person{' '}
									</label>
									<div
										onClick={() => {
											setOpenGender(!openGender);
											setOpenRole(false);
											setOpenOccasion(false);
											setGenderError(false);
										}}
										className={styles.dropdown}
										style={{
											border: genderError && ' 2px solid red',
											borderRadius: openGender ? '10px 10px 0px 0px' : '10px',
										}}
									>
										<span>{selectedGender ? selectedGender : 'select'}</span>
										<BiChevronDown size={25} />
									</div>
									<ul
										style={{ display: openGender ? 'block' : 'none' }}
										className={styles.dropdownitems}
									>
										<li
											onClick={() => {
												setSelectedGender('male');
												setOpenGender(false);
											}}
										>
											Male
										</li>
										<li
											onClick={() => {
												setSelectedGender('female');
												setOpenGender(false);
											}}
										>
											Female
										</li>
										<li
											onClick={() => {
												setSelectedGender('other');
												setOpenGender(false);
											}}
										>
											Other
										</li>
									</ul>
								</div>

								<div className={styles.inputgroup}>
									<label>
										<span className={styles.important}>*</span>What is this person for you?{' '}
									</label>
									<div
										onClick={() => {
											setOpenRole(!openRole);
											setRoleError(false);
											setOpenGender(false);
											setOpenOccasion(false);
										}}
										className={styles.dropdown}
										style={{
											border: roleError && ' 2px solid red',
											borderRadius: openRole ? '10px 10px 0px 0px' : '10px',
										}}
									>
										<span>{selectedRole ? selectedRole : 'select'}</span>
										<BiChevronDown size={25} />
									</div>
									<ul
										style={{ display: openRole ? 'block' : 'none' }}
										className={styles.dropdownitems}
									>
										<li
											onClick={() => {
												setSelectedRole('romantic partner');
												setOpenRole(false);
											}}
										>
											Romantic partner
										</li>
										<li
											onClick={() => {
												setSelectedRole('colleague');
												setOpenRole(false);
											}}
										>
											Colleague
										</li>
										<li
											onClick={() => {
												setSelectedRole('supervisor');
												setOpenRole(false);
											}}
										>
											Supervisor
										</li>
										<li
											onClick={() => {
												setSelectedRole('friend');
												setOpenRole(false);
											}}
										>
											Friend
										</li>
										<li
											onClick={() => {
												setSelectedRole('sibling');
												setOpenRole(false);
											}}
										>
											Sibling
										</li>
										<li
											onClick={() => {
												setSelectedRole('parent');
												setOpenRole(false);
											}}
										>
											Parent
										</li>
										<li
											onClick={() => {
												setSelectedRole('grandparent');
												setOpenRole(false);
											}}
										>
											Grandparent
										</li>
										<li
											onClick={() => {
												setSelectedRole('sibling of your parent');
												setOpenRole(false);
											}}
										>
											Sibling of your parent
										</li>
										<li
											onClick={() => {
												setSelectedRole('offspring');
												setOpenRole(false);
											}}
										>
											Offspring
										</li>
										<li
											onClick={() => {
												setSelectedRole('offspring of your sibling or partners sibling');
												setOpenRole(false);
											}}
										>
											Offspring of your sibling or partners sibling
										</li>
										<li
											onClick={() => {
												setSelectedRole('cousin');
												setOpenRole(false);
											}}
										>
											Cousin
										</li>
									</ul>
								</div>

								<div className={styles.inputgroup}>
									<label>
										<span className={styles.important}>*</span>Age of the person
									</label>
									<div
										style={{
											border: ageError && ' 2px solid red',
										}}
										className={styles.numberinput}
									>
										<input
											type="number"
											min="1"
											max="120"
											value={ageValue}
											onChange={(e) => {
												setAgeValue(e.target.value);
												setAgeError(false);
											}}
										/>
										<span>Years Old</span>
									</div>
								</div>

								<div className={styles.inputgroup}>
									<label>Occupation</label>
									<div
										style={{
											border: ageError && ' 2px solid red',
										}}
										className={styles.numberinput}
									>
										<input
											type="text"
											min="1"
											max="120"
											value={occupation}
											placeholder="Policeman"
											onChange={(e) => {
												setOccupation(e.target.value);
											}}
										/>
									</div>
								</div>

								<div className={styles.inputgroup}>
									<label>
										<span className={styles.important}>*</span>
										Enter the person&apos;s interests{' '}
										<span
											className={styles.require}
											style={{
												color: tagsError && 'red',
											}}
										>
											Atleast 3
										</span>
									</label>
									<div
										style={{
											border: tagsError && '2px solid red',
										}}
										className={styles.interestinputarea}
									>
										{tags.map((tag, index) => (
											<div key={index} className={styles.tagitem}>
												<span className={styles.tagname}>{tag}</span>
												<span
													onClick={() => removeTag(index)}
													className={styles.tagicon}
												>
													<HiX size={16} />
												</span>
											</div>
										))}
										<input
											onKeyDown={handleKeydown}
											placeholder="Enter an interest..."
											className={styles.interestinput}
											type="text"
										/>
									</div>
								</div>

								<div className={styles.submit}>
									<button type="submit">Generate Ideas</button>
								</div>
							</div>
						</form>
					</div>
				</section>
			)}
		</>
	);
}


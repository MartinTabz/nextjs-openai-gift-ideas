import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import { useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { HiX } from 'react-icons/hi';

export default function Home() {
	// Gender input and selection box
	const [selectedGender, setSelectedGender] = useState('');
	const [openGender, setOpenGender] = useState(false);

	// Age input
	const [ageValue, setAgeValue] = useState('');

	// Declaration of tags array
	const [tags, setTags] = useState([]);
	//Function for processing the tags
	function handleKeydown(e) {
		if (e.key !== 'Enter') {
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
	const getIdeas = (e) => {
		e.preventDefault();

		// Error conditions
		var inputerror = false;
		if (!selectedGender) {
			console.log('Gender was not chosen!');
			inputerror = true;
		}
		if (!ageValue) {
			console.log('Input age of the person!');
			inputerror = true;
		}
		if (tags.length <= 4) {
			console.log(
				'There must be atleas 5 interests! You have only ' +
					tags.length.toString()
			);
			inputerror = true;
		}

		// If there is no error, data gets sent to API
		if (!inputerror) {
			const body = {
				gender: selectedGender,
				age: ageValue,
				interest: tags,
			};
			console.log(JSON.stringify(body));
		}
	};

	return (
		<>
			<Head>
				<title>Generate Gift Ideas</title>
			</Head>
			<section className={styles.ideapage}>
				<div className={styles.formarea}>
					<form onKeyDown={handleKeydownForm} onSubmit={getIdeas}>
						<div className={styles.innerform}>
							{/* Gender input */}
							<div className={styles.inputgroup}>
								<label>Select the gender of the person </label>
								<div
									onClick={() => setOpenGender(!openGender)}
									className={styles.dropdown}
									style={{
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
								<label>Age of the person</label>
								<div className={styles.numberinput}>
									<input
										type="number"
										min="1"
										max="120"
										value={ageValue}
										onChange={(e) => setAgeValue(e.target.value)}
									/>
									<span>Years Old</span>
								</div>
							</div>

							<div className={styles.inputgroup}>
								<label>Enter the person&apos;s interests</label>
								<div className={styles.interestinputarea}>
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
		</>
	);
}
